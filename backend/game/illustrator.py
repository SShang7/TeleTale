# -*- coding: utf-8 -*-
"""
Created on Sun Nov 27 15:54:27 2022

@author: sammy
"""

import base64
from typing import List
import flair
from flair.models import SequenceTagger
from flair.tokenization import SegtokSentenceSplitter
from keyphrase_vectorizers import KeyphraseCountVectorizer
import re
import warnings
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation
from django.conf import settings


def illustrate(text):
    # define flair POS-tagger and splitter
    tagger = SequenceTagger.load('pos')
    splitter = SegtokSentenceSplitter()

    # define custom POS-tagger function using flair

    def custom_pos_tagger(raw_documents: List[str], tagger: flair.models.SequenceTagger = tagger, splitter: flair.tokenization.SegtokSentenceSplitter = splitter) -> List[tuple]:
        """
        The mandatory 'raw_documents' parameter can NOT be named differently and has to expect a list of strings. 
        Any other parameter of the custom POS-tagger function can be arbitrarily defined, depending on the respective use case. 
        Furthermore the function has to return a list of (word token, POS-tag) tuples.
        """
        # split texts into sentences
        sentences = []
        for doc in raw_documents:
            sentences.extend(splitter.split(doc))

        # predict POS tags
        tagger.predict(sentences)

        # iterate through sentences to get word tokens and predicted POS-tags
        pos_tags = []
        words = []
        for sentence in sentences:
            pos_tags.extend(
                [label.value for label in sentence.get_labels('pos')])
            words.extend([word.text for word in sentence])

        return list(zip(words, pos_tags))

    # init vectorizer
    vectorizer = KeyphraseCountVectorizer(
        lowercase=False, custom_pos_tagger=custom_pos_tagger)
    vectorizer.fit(text)

    # find keyphrases
    keyphrases = vectorizer.get_feature_names_out()

    def check_space(Test_string):
        return Test_string.count(" ")*0.90 + 0.1*len(Test_string)

    # select best phrase based on space count
    phrase = max(keyphrases, key=check_space)

    def describe(phrase, text):
        for t in text:
            m = re.search(f"({phrase}[^.?!;:—]*)", t)
            if m:
                found = m.group(1)
                return found
        return None

    description = describe(phrase, text)

    stability_api = client.StabilityInference(
        key=settings.STABLEDIFFUSION_API,
        verbose=True,
        engine="stable-diffusion-v1-5"
    )

    answers = stability_api.generate(
        prompt=description,
        width=256,
        height=256,
        samples=1,
        seed=12345
    )

    for resp in answers:
        for artifact in resp.artifacts:
            if artifact.finish_reason == generation.FILTER:
                warnings.warn(
                    "Your request activated the API's safety filters and could not be processed."
                    "Please modify the prompt and try again.")
            if artifact.type == generation.ARTIFACT_IMAGE:
                data_url = f"data:image/png;base64,{base64.b64encode(artifact.binary).decode('utf-8')}"
                return (data_url, description)
