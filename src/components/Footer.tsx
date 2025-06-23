
import { Phone, Mail, MapPin, Trophy, Facebook, Twitter, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="footer-section" className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-amber-500" />
              <h3 className="text-xl font-bold">UTA Tennis</h3>
            </div>
            <p className="text-slate-300 text-sm">
              Uttaranchal Tennis Association - Promoting excellence in tennis through 
              competitive tournaments and community engagement.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-400">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-amber-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-amber-500" />
                <span>info@utatennis.org</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-amber-500 mt-1" />
                <span>Tennis Complex, Dehradun<br />Uttarakhand, India - 248001</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-400">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block hover:text-amber-400 transition-colors">Tournament Rules</a>
              <a href="#" className="block hover:text-amber-400 transition-colors">Registration Guidelines</a>
              <a href="#" className="block hover:text-amber-400 transition-colors">Past Results</a>
              <a href="#" className="block hover:text-amber-400 transition-colors">Gallery</a>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-400">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-700 rounded-full hover:bg-amber-600 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-slate-700 rounded-full hover:bg-amber-600 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-slate-700 rounded-full hover:bg-amber-600 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
            <div className="text-sm text-slate-400">
              <p>Tournament Enquiries:</p>
              <p className="text-amber-400">tournaments@utatennis.org</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>&copy; 2024 Uttaranchal Tennis Association. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
