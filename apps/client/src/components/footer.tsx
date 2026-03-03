import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const navigation = {
  main: [
    { name: "Sobre", href: "#" },
    { name: "Termos", href: "#" },
    { name: "Privacidade", href: "#" },
    { name: "Contato", href: "#" },
  ],
  social: [
    {
      name: "GitHub",
      href: "https://github.com/gabrieudev",
      icon: FaGithub,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/gabrieudev",
      icon: FaLinkedin,
    },
  ],
};

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
        <nav
          className="flex flex-wrap justify-center gap-x-8 gap-y-4"
          aria-label="Footer"
        >
          {navigation.main.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex justify-center space-x-10">
          {navigation.social.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">{item.name}</span>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
        <p className="mt-10 text-center text-xs leading-5 text-muted-foreground">
          &copy; {new Date().getFullYear()} Regex Builder. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
