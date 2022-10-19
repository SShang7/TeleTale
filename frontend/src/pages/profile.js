
import "./style.css"

function Profile() {
    return (
        <div>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
            />
            <div className="card">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Facebook_default_male_avatar.gif" alt="John" style={{ width: "100%" }} />
                <h1>FirstName LastName</h1>
                <p className="email">ThisIsMyEmail@mail.com</p>
                <p>This is my bio, This is my bio, This is my bio, This is my bio, This is my bio</p>
                <p>
                <button>Save</button>
                </p>
            </div>
        </div>
    );
}

export default Profile;