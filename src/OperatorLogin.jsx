import React, { useState } from "react";

export default function OperatorLogin({ onLogin }) {
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      if (onLogin) {
        onLogin({ department, role });
      }
    }, 800);
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-surface-container-low font-body-md text-on-surface">
      <div className="flex flex-col w-full min-h-screen relative overflow-hidden bg-surface-container-low items-center justify-center p-gutter">
        {/* Background decorative blurs */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 -z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-primary-fixed-dim/20 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-secondary-fixed/20 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2" />

        {/* Card */}
        <div className="w-full max-w-[480px] bg-surface-container-lowest shadow-xl rounded-xl p-stack-lg relative z-10 flex flex-col items-center">
          {/* Header */}
          <div className="flex flex-col items-center justify-center text-center mb-stack-lg w-full">
            <img
              alt="IMC Official Crest"
              className="w-[88px] h-[88px] object-cover rounded-full mb-stack-md shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUyfZ6VHyAjtSH-M__FTNUz0zaI3UDyDJD16Kb8pb5nMq44LLpHtDGXclsq2ifgqH0IKT0JLnJlhC49bw8axbGY446RKfu4ybCrLBBMBrf5ErUOpfioXrrtTGG7RGOPN34jIzUFewIB2Jl_BAhjEs6KYgmzlLus1_DxOfeSzCAZwQoIMXA1zeoLNF2VEwG6PqKDy_T91MxifV40LUscYYAQWeQzTuC1jhoeDMpTWrNzrz2BUlk0Mu_SA"
            />
            <h1 className="text-headline-lg font-headline-lg text-primary mb-stack-sm tracking-tight">
              Smart Junction Control
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-[320px]">
              Indore Municipal Corporation
              <br />
              <span className="text-label-sm font-label-bold uppercase tracking-widest text-primary/70 mt-unit block">
                Authorized Personnel Only
              </span>
            </p>
          </div>

          {/* Form */}
          <form className="w-full flex flex-col gap-stack-md" id="loginForm" onSubmit={handleSubmit}>
            {/* Department */}
            <div className="flex flex-col gap-stack-sm">
              <label className="text-body-md font-label-bold text-on-surface" htmlFor="department">
                Department
              </label>
              <div className="relative w-full">
                <select
                  className="w-full appearance-none bg-surface border border-outline-variant rounded-lg px-[16px] py-[12px] text-body-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                  id="department"
                  name="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option disabled value="">
                    Select Department
                  </option>
                  <option value="traffic">Traffic Management</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <span className="material-symbols-outlined absolute right-[12px] top-[12px] text-outline pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Role */}
            <div className="flex flex-col gap-stack-sm">
              <label className="text-body-md font-label-bold text-on-surface" htmlFor="role">
                Role
              </label>
              <div className="relative w-full">
                <select
                  className="w-full appearance-none bg-surface border border-outline-variant rounded-lg px-[16px] py-[12px] text-body-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option disabled value="">
                    Select Role
                  </option>
                  <option value="operator">Operator</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Administrator</option>
                </select>
                <span className="material-symbols-outlined absolute right-[12px] top-[12px] text-outline pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-stack-sm">
              <label className="text-body-md font-label-bold text-on-surface" htmlFor="password">
                Secure Password
              </label>
              <div className="relative w-full">
                <input
                  className="w-full bg-surface border border-outline-variant rounded-lg px-[16px] py-[12px] text-body-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm placeholder:text-outline"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  aria-label="Toggle password visibility"
                  className="absolute right-[12px] top-[12px] text-outline hover:text-primary transition-colors focus:outline-none flex items-center justify-center"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className={`w-full mt-stack-md bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-bold text-body-lg uppercase tracking-wide py-[16px] rounded-lg shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-unit ${
                isAuthenticating ? "opacity-75" : ""
              }`}
              type="submit"
            >
              <span className="material-symbols-outlined text-[20px]">lock</span>
              {isAuthenticating ? "Authenticating..." : "Secure Authenticate"}
            </button>
          </form>

          {/* Footer Status */}
          <div className="mt-stack-lg flex flex-col items-center gap-unit text-label-sm font-label-sm text-on-surface-variant/60 w-full text-center">
            <p>Connection secured via Govt. Intranet</p>
            <div className="flex items-center gap-unit">
              <span className="w-[8px] h-[8px] rounded-full bg-[#2e7d32] shadow-[0_0_8px_rgba(46,125,50,0.5)]" />
              <span>System Status: Online</span>
            </div>
          </div>
        </div>

        {/* Version */}
        <div className="fixed bottom-gutter left-gutter flex items-center gap-unit text-data-mono font-data-mono text-outline/50 z-0">
          <span className="material-symbols-outlined text-[16px]">terminal</span>
          <span>v2.4.1-stable</span>
        </div>
      </div>
    </main>
  );
}
