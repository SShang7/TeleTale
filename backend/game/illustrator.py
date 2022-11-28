# -*- coding: utf-8 -*-
"""
Created on Sun Nov 27 15:54:27 2022

@author: sammy
"""
from typing import List
import flair
from flair.models import SequenceTagger
from flair.tokenization import SegtokSentenceSplitter
from keyphrase_vectorizers import KeyphraseCountVectorizer
import re

text = ["He talked of his dreams in a strangely poetic fashion; making me see with terrible vividness the damp Cyclopean city of slimy green stone—whose geometry, he oddly said, was all wrong—and hear with frightened expectancy the ceaseless, half-mental calling from underground: “Cthulhu fhtagn”, “Cthulhu fhtagn”. These words had formed part of that dread ritual which told of dead Cthulhu’s dream-vigil in his stone vault at R’lyeh, and I felt deeply moved despite my rational beliefs. Wilcox, I was sure, had heard of the cult in some casual way, and had soon forgotten it amidst the mass of his equally weird reading and imagining. Later, by virtue of its sheer impressiveness, it had found subconscious expression in dreams, in the bas-relief, and in the terrible statue I now beheld; so that his imposture upon my uncle had been a very innocent one. The youth was of a type, at once slightly affected and slightly ill-mannered, which I could never like; but I was willing enough now to admit both his genius and his honesty. I took leave of him amicably, and wish him all the success his talent promises."
]
# define flair POS-tagger and splitter
tagger = SequenceTagger.load('pos')
splitter = SegtokSentenceSplitter()

# define custom POS-tagger function using flair
def custom_pos_tagger(raw_documents: List[str], tagger: flair.models.SequenceTagger = tagger, splitter: flair.tokenization.SegtokSentenceSplitter = splitter)->List[tuple]:
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
        pos_tags.extend([label.value for label in sentence.get_labels('pos')])
        words.extend([word.text for word in sentence])
    
    return list(zip(words, pos_tags))


#init vectorizer
vectorizer = KeyphraseCountVectorizer(lowercase = False, custom_pos_tagger=custom_pos_tagger)
vectorizer.fit(text)

#find keyphrases
keyphrases = vectorizer.get_feature_names_out()
def check_space(Test_string):
    return Test_string.count(" ")*0.90 + 0.1*len(Test_string)

#select best phrase based on space count
phrase = max(keyphrases, key=check_space)
def describe(phrase, text):
    for t in text:
        m = re.search(f"({phrase}[^.?!;:—]*)", t)
        if m:
            found = m.group(1)
            return found
    return None
description = describe(phrase, text)
    
print(description)