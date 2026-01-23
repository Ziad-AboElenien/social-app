import Authhero from "../../Components/Authhero/Authhero";
import ForgotPassword from "../../Components/ForgotPassword/ForgotPassword";

export default function ForgotPasswordPage() {
    return (
        <>
            <main>
                <div className="grid lg:grid-cols-2 ">
                    {/* signup hero */}
                    <Authhero title={{ head: 'Welcome back', body: 'to SocialHub App' }} desc='Please login to continue connecting with amazing people.' />

                    {/* signup form */}
                    <ForgotPassword />
                </div>
            </main>
        </>
    )
}