import React from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LogIn } from "lucide-react";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
            <LogIn className="h-7 w-7 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to manage your tasks</p>
        </div>

        <Card>
          <form className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              name="email"
              placeholder="admin@test.com"
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••"
              autoComplete="current-password"
            />
            <Button type="submit" variant="primary" className="w-full mt-1" size="lg">
              Sign in
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-4">
          Default credentials: <span className="font-mono">admin@test.com</span> / <span className="font-mono">123456</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
