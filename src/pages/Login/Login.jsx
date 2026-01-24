import LoginForm from "../../Components/LoginForm/LoginForm";
import Authhero from "../../Components/Authhero/Authhero";

export default function Login() {
    return (
        <>
            <main>
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                    {/* signup hero */}
                    <Authhero title={{ head: 'Welcome back', body: 'to SocialHub App' }} desc='Please login to continue connecting with amazing people.' />

                    {/* signup form */}
                    <LoginForm />
                </div>
            </main>
        </>
    )
}