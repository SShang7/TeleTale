import { Button } from "@mui/material";
import { Google } from "@mui/icons-material";

function Login() {
    return (
        <div>
            <Button variant="contained" endIcon={<Google></Google>}>
                Login
            </Button>
        </div>
    );
}

export default Login;
