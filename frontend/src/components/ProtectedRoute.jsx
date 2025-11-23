import { Navigate } from "react-router-dom";
import { useSession } from "../lib/auth-client.ts";

export default function ProtectedRoute({ children }) {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-black">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
