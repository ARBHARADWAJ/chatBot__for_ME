// src/pages/RegisterPage.jsx

import React,{useState} from 'react';
import Input from '../components/ui/Inputs';
import Button from '../components/ui/Buttons';

function RegisterPage() {
    // 👇 Step 2: Create state variables to "remember" input values
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 👇 Step 4: Create a function to handle form submission
    const handleSubmit = (event) => {
        // Prevents the default browser behavior of reloading the page on form submission
        event.preventDefault();

        // For now, we'll just log the data to the console
        console.log("Form Submitted with data:", { fullName, email, password });
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Sign up for an account
                </h2>

                {/* 👇 Step 5: Connect the handler to the form's onSubmit event */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        {/* 👇 Step 3: Connect state to the Input components */}
                        <Input
                            label="Full Name:"
                            type="text"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            label="Email:"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            label="Password:"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    <Button type="submit" className="w-full" value="create">
                        Create Account
                    </Button>
                </form>
            </div>
        </div>
    );
}
// function RegisterPage() {
//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//                 <h2 className="text-2xl font-bold text-center text-gray-800">
//                     Sign up for an account
//                 </h2>

//                 <form className="space-y-6">
//                     {/* Here we use our reusable Input component */}
//                     <div>
//                         <Input
//                             label="Full Name:"
//                             type="text"
//                             placeholder="Enter your full name"
//                         />
//                     </div>
//                     <div>
//                         <Input
//                             label="Email:"
//                             type="email"
//                             placeholder="Enter your email"
//                         />
//                     </div>
//                     <div>
//                         <Input
//                             label="Password:"
//                             type="password"
//                             placeholder="Enter your password"
//                         />
//                     </div>

//                     {/* And here we use our reusable Button component */}
//                     <Button type="submit" className="w-full">
//                         Create Account
//                     </Button>
//                 </form>
//             </div>
//         </div>
//     );
// }

export default RegisterPage;