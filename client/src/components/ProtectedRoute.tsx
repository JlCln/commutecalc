import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, token, verifyAuth } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyAuth();
      } catch (error) {
        console.error("Auth verification failed:", error);
      } finally {
        setIsVerifying(false);
      }
    };

    if (token && !user) {
      verify();
    } else {
      setIsVerifying(false);
    }
  }, [token, user, verifyAuth]);

  if (isVerifying) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Verifying authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
