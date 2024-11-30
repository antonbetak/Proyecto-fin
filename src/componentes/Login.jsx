import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/auth'; 
import logo from '../assets/logo.png';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerRole, setRegisterRole] = useState('user'); 

  const handleLogin = async () => {
    const { user, role, error } = await loginUser(username, password);
    if (user) {
      onLogin(role); 
      localStorage.setItem('userRole', role);
    } else {
      alert(error || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async () => {
    const additionalData = { name: registerName, role: registerRole };
    const { user, error } = await registerUser(email, registerPassword, additionalData);
    if (user) {
      alert('Usuario registrado correctamente.');
      setIsRegistering(false);
    } else {
      alert(error || 'Error al registrar usuario');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={imageContainerStyle}>
        <img src={logo} alt="Logo" style={imageStyle} />
      </div>
      <div style={formStyle}>
        {isRegistering ? (
          <>
            <h2>Registro</h2>
            <input 
              type="text" 
              placeholder="Nombre" 
              value={registerName} 
              onChange={(e) => setRegisterName(e.target.value)} 
              style={inputStyle} 
            />
            <br />
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={inputStyle} 
            />
            <br />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={registerPassword} 
              onChange={(e) => setRegisterPassword(e.target.value)} 
              style={inputStyle} 
            />
            <br />
            <label style={labelStyle}>Rol:</label>
            <select 
              value={registerRole} 
              onChange={(e) => setRegisterRole(e.target.value)} 
              style={selectStyle}
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
            <br />
            <button 
              onClick={handleRegister} 
              style={primaryButtonStyle}
            >
              Registrarse
            </button>
            <br />
            <button onClick={() => setIsRegistering(false)} style={secondaryButtonStyle}>
              Ya tengo una cuenta
            </button>
          </>
        ) : (
          <>
            <h2>Inicio de Sesión</h2>
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={inputStyle} 
            />
            <br />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={inputStyle} 
            />
            <br />
            <button 
              onClick={handleLogin} 
              style={primaryButtonStyle}
            >
              Iniciar Sesión
            </button>
            <br />
            <button onClick={() => setIsRegistering(true)} style={secondaryButtonStyle}>
              Crear una cuenta
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#1a202c',
  padding: '20px'
};

const imageContainerStyle = {
  flex: 1,
  textAlign: 'center',
  padding: '20px',
  marginLeft: '20px',
};

const imageStyle = {
  maxWidth: '40%',
  height: 'auto',
  borderRadius: '8px',
};

const formStyle = {
  backgroundColor: '#1a202c',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  width: '300px',
  textAlign: 'center',
  flex: 1,
};

const inputStyle = {
  marginBottom: '12px',
  padding: '10px',
  width: '100%',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '14px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const selectStyle = {
  padding: '10px',
  width: '100%',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '14px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const labelStyle = {
  marginRight: '10px',
};

const primaryButtonStyle = {
  padding: '10px 20px',
  backgroundColor: 'green',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '20px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
};

const secondaryButtonStyle = {
  padding: '10px 20px',
  backgroundColor: 'blue',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
};

export default Login;
