
// "use server"; 
// Note: In a real Next.js or RSC environment, this directive would create a server-side function.
// Here, we are simulating its behavior on the client side for demonstration purposes.

export interface ContactFormState {
    message: string;
    success: boolean;
}

export async function submitContactForm(
    prevState: ContactFormState, 
    formData: FormData
): Promise<ContactFormState> {
    console.log("Simulating server action...");
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Simulate server-side validation
    if (!name || !email || !message) {
        return { message: "All fields are required.", success: false };
    }
    if (!/^\S+@\S+\.\S+$/.test(email as string)) {
        return { message: "Please enter a valid email.", success: false };
    }
    
    console.log("Received data on 'server':", { name, email, message });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate a successful submission
    return { message: `Thank you, ${name}! Your message has been received.`, success: true };
}
