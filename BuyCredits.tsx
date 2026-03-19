import React, { useState } from 'react';
import axios from 'axios';
import { User } from '../types.ts';

interface CreditPackage {
    id: string;
    name: string;
    credits: number;
    price: number;
    description: string;
}

const PACKAGES: CreditPackage[] = [
    { id: 'pkg_10', name: 'Basic', credits: 10, price: 200, description: 'For occasional use.' },
    { id: 'pkg_20', name: 'Standard', credits: 20, price: 400, description: 'Best value for regular teachers.' },
    { id: 'pkg_30', name: 'Premium', credits: 30, price: 500, description: 'For heavy power users.' },
];

interface BuyCreditsProps {
    currentUser: User;
    onCancel?: () => void;
}

const BuyCredits: React.FC<BuyCreditsProps> = ({ currentUser, onCancel }) => {
    const [selectedPkg, setSelectedPkg] = useState<CreditPackage | null>(null);
    const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '');
    const [step, setStep] = useState<'select' | 'pay' | 'processing' | 'success' | 'error'>('select');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSelect = (pkg: CreditPackage) => {
        setSelectedPkg(pkg);
        setStep('pay');
    };

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
            const response = await axios.post(
                import.meta.env.VITE_API_URL + '/stk',
                {
                    phone: formattedPhone,
                    amount: selectedPkg?.price,
                    userId: currentUser.id
                }
            );

            if (response.data) {
                setStep('success');
            } else {
                throw new Error('Failed to initiate STK');
            }

        } catch (error: any) {
            console.error(error);
            setErrorMessage(error.response?.data?.error || error.message);
            setStep('error');
        }
    };

    const handleComplete = () => {
        setStep('select');
        setSelectedPkg(null);
        if (onCancel) onCancel();
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl w-full">

            {/* SELECT */}
            {step === 'select' && (
                <div className="grid md:grid-cols-3 gap-6">
                    {PACKAGES.map((pkg) => (
                        <div key={pkg.id} onClick={() => handleSelect(pkg)} className="p-6 border rounded-xl cursor-pointer hover:shadow-lg">
                            <h3 className="text-xl font-bold">{pkg.name}</h3>
                            <p>{pkg.credits} Credits</p>
                            <p className="font-bold text-green-600">Ksh {pkg.price}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* PAY */}
            {step === 'pay' && selectedPkg && (
                <form onSubmit={handlePayment} className="max-w-md mx-auto p-6">
                    <h3 className="text-xl font-bold mb-4">
                        Pay Ksh {selectedPkg.price}
                    </h3>

                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0712345678"
                        className="w-full p-3 border mb-4"
                        required
                    />

                    <div className="flex gap-3">
                        <button type="button" onClick={() => setStep('select')} className="flex-1 border p-3">
                            Back
                        </button>

                        <button type="submit" className="flex-1 bg-green-600 text-white p-3">
                            Pay Now
                        </button>
                    </div>
                </form>
            )}

            {/* PROCESSING */}
            {step === 'processing' && (
                <div className="text-center p-10">
                    <p>Processing... Check your phone</p>
                </div>
            )}

            {/* SUCCESS */}
            {step === 'success' && (
                <div className="text-center p-10">
                    <h3 className="text-green-600 text-xl font-bold">
                        STK Sent ✅
                    </h3>
                    <button onClick={handleComplete} className="mt-4 bg-green-600 text-white p-3">
                        Done
                    </button>
                </div>
            )}

            {/* ERROR */}
            {step === 'error' && (
                <div className="text-center p-10">
                    <h3 className="text-red-600 font-bold">Error</h3>
                    <p>{errorMessage}</p>
                    <button onClick={() => setStep('pay')} className="mt-4 bg-gray-600 text-white p-3">
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
};

export default BuyCredits;
