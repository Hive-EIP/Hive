import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/resetPassword.css'; // (à créer juste après)

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const res = await axios.post('http://localhost:4000/auth/reset-password', {
                token,
                newPassword,
            });

            setSuccess(true);
            setMessage("✅ Mot de passe mis à jour avec succès ! Redirection...");
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            console.error(err);
            setSuccess(false);
            setMessage("❌ Erreur : " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="reset-container">
            <form className="reset-form" onSubmit={handleReset}>
                <h2>🔐 Réinitialiser votre mot de passe</h2>
                <input
                    className="reset-input"
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    required
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button className="reset-button" type="submit">Réinitialiser</button>
                {message && (
                    <p className={`reset-message ${success ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}

export default ResetPassword;
