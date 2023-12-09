import Link from "next/link";
import { Facebook, Github, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-zinc-800">
      <div className="container flex flex-wrap items-center justify-center px-4 py-8 mx-auto lg:justify-between">
        <div className="flex flex-wrap justify-center">
          <ul className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-white">
                Contact US
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-white">
                Terms & Condition
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex justify-center space-x-4 mt-4 lg:mt-0">
          <Link href="/">
            <Facebook color="white" />
          </Link>
          <Link href="/">
            <Github color="white" />
          </Link>
          <Link href="/">
            <Instagram color="white" />
          </Link>
          <Link href="/">
            <Linkedin color="white" />
          </Link>
        </div>
      </div>
      <div className="pb-2 text-white">
        <p className="text-center">@2024 All rights reserved by StudyTogether.</p>
      </div>
    </footer>
  );
};
export default Footer;
