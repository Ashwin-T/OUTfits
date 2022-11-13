import './login.css';
import logo from '../../assets/images/logo.png';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const Login = ({setIsUserLoggedIn}) => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      setIsUserLoggedIn(true)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }
 
  return (
    <div className="login">
      <img className = 'logo' src ={logo} alt="logo" />
      <button onClick={signInWithGoogle}>
        <img src = "https://i0.wp.com/nanophorm.com/wp-content/uploads/2018/04/google-logo-icon-PNG-Transparent-Background.png?fit=1000%2C1000&ssl=1&w=640" alt="google logo"/>
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;