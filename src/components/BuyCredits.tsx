const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    let formattedPhone = phoneNumber.trim();

    if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('+254')) {
        formattedPhone = formattedPhone.replace('+', '');
    } else if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
    }

    if (!formattedPhone.match(/^254(7|1)\d{8}$/)) {
        alert("Enter valid phone (e.g. 0712345678)");
        return;
    }

    setStep('processing');

    try {
        // ✅ USE SERVICE (clean architecture)
        await initiateSTK(formattedPhone, selectedPkg!.price);

        setStep('success');

    } catch (error: any) {
        console.error('Payment Error:', error);
        setErrorMessage(error.message || 'Payment failed');
        setStep('error');
    }
};
