import SignUpForm from "../../Components/signupform/signupform";
import Authhero from "../../Components/Authhero/Authhero";

export default function Signup() {
    return (
        <>
            <main>
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                    {/* signup hero */}
                    <Authhero title={{ head: 'Connect with', body: 'amazing people' }} desc='Join millions of users sharing their stories, experiences, and ideas.and building a vibrant community together.' />
                    {/* signup form */}
                    <SignUpForm />
                </div>
            </main>
        </>
    )
}