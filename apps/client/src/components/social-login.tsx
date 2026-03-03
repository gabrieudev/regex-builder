import { Button } from "@/components/ui/button";
import { GITHUB_AUTH_URL, GOOGLE_AUTH_URL } from "@/lib/constants";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

interface SocialLoginProps {
  method: "signup" | "signin";
}

export default function SocialLogin({ method }: SocialLoginProps) {
  return (
    <div className="space-y-3">
      <motion.a
        href={GOOGLE_AUTH_URL}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="block"
      >
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 cursor-pointer"
        >
          <FaGoogle />
          {method === "signup"
            ? "Cadastrar-se com Google"
            : "Entrar com Google"}
        </Button>
      </motion.a>
      <motion.a
        href={GITHUB_AUTH_URL}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="block"
      >
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 cursor-pointer"
        >
          <FaGithub />
          {method === "signup"
            ? "Cadastrar-se com Github"
            : "Entrar com Github"}
        </Button>
      </motion.a>
    </div>
  );
}
