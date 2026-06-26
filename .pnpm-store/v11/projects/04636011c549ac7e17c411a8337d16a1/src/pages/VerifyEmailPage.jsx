import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your email...");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("Invalid verification link.");
      return;
    }

    api
      .post(`/auth/verify-email/${token}`)
      .then(() => {
        setVerified(true);
        setStatus("Email verified successfully. You can now sign in.");
      })
      .catch((err) => {
        setStatus(
          err.response?.data?.message ||
            "Verification link is invalid or expired.",
        );
      });
  }, [token]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Verify email</CardTitle>
            <CardDescription>{status}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate("/login")}>
              {verified ? "Go to login" : "Back to login"}
            </Button>
          </CardContent>
        </Card>
        <p className="mt-6 px-6 text-center text-sm text-muted-foreground">
          Need a new link? <Link to="/login">Return to login</Link>
        </p>
      </div>
    </div>
  );
}
