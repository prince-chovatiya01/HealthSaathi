import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Stethoscope, PlusCircle, Pill as Pills, Phone, Video, Shield, Languages } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import translations from '../utils/translations';

const HomePage = () => {
  const { language } = useHealthSaathi();
  const t = translations[language];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                {t.welcomeToHealthSaathi}
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 mb-8">
                {t.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    {t.getStarted}
                  </Button>
                </Link>
                <a href="#services">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-indigo-700 w-full sm:w-auto">
                    {t.ourServices}
                  </Button>
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Doctor with patient" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t.ourServices}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              HealthSaathi provides comprehensive healthcare services designed specifically for rural communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <Card hoverable className="border border-gray-100">
              <div className="p-6">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Online Doctor Consultations</h3>
                <p className="text-gray-600 mb-4">
                  Connect with qualified doctors via video call from the comfort of your home.
                </p>
                <Link to="/doctors">
                  <Button variant="ghost" size="sm" className="mt-2">
                    Find Doctors →
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Service 2 */}
            <Card hoverable className="border border-gray-100">
              <div className="p-6">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <PlusCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Symptom Checker</h3>
                <p className="text-gray-600 mb-4">
                  Describe your symptoms and get instant AI-powered insights and recommendations.
                </p>
                <Link to="/symptom-checker">
                  <Button variant="ghost" size="sm" className="mt-2">
                    Check Symptoms →
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Service 3 */}
            <Card hoverable className="border border-gray-100">
              <div className="p-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Pills className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Medicine Delivery</h3>
                <p className="text-gray-600 mb-4">
                  Order prescribed medicines online and get them delivered to your doorstep.
                </p>
                <Link to="/medicines">
                  <Button variant="ghost" size="sm" className="mt-2">
                    Order Medicines →
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Service 4 */}
            <Card hoverable className="border border-gray-100">
              <div className="p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Health Records</h3>
                <p className="text-gray-600 mb-4">
                  Store and access your medical records securely anytime, anywhere.
                </p>
                <Link to="/health-records">
                  <Button variant="ghost" size="sm" className="mt-2">
                    Manage Records →
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Service 5 */}
            <Card hoverable className="border border-gray-100">
              <div className="p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Video className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Health Camps</h3>
                <p className="text-gray-600 mb-4">
                  Participate in virtual health camps conducted by healthcare experts.
                </p>
                <a href="#">
                  <Button variant="ghost" size="sm" className="mt-2">
                    Upcoming Camps →
                  </Button>
                </a>
              </div>
            </Card>

            {/* Service 6 */}
            <Card hoverable className="border border-gray-100">
              <div className="p-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Languages className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multilingual Support</h3>
                <p className="text-gray-600 mb-4">
                  Access healthcare information and services in your preferred language.
                </p>
                <a href="#">
                  <Button variant="ghost" size="sm" className="mt-2">
                    Learn More →
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t.testimonials}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from people whose lives have been impacted by HealthSaathi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.pexels.com/photos/3799821/pexels-photo-3799821.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Testimonial" 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-medium">Ananya Sharma</h4>
                  <p className="text-gray-500 text-sm">Madhya Pradesh</p>
                </div>
              </div>
              <p className="text-gray-600">
                "HealthSaathi helped me consult with a doctor during the pandemic when I couldn't travel to the city. The video consultation was clear and the doctor was very helpful."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.pexels.com/photos/3201695/pexels-photo-3201695.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Testimonial" 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-medium">Rajesh Kumar</h4>
                  <p className="text-gray-500 text-sm">Bihar</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The medicine delivery service has been a blessing for my elderly parents. They no longer have to travel 20km to get their monthly medications."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.pexels.com/photos/2720001/pexels-photo-2720001.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Testimonial" 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-medium">Lakshmi Devi</h4>
                  <p className="text-gray-500 text-sm">Tamil Nadu</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I love that I can use HealthSaathi in Tamil! The symptom checker helped me understand what might be wrong and when I should see a doctor urgently."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to take control of your health?</h2>
            <p className="text-lg mb-8">
              Join thousands of users who are already benefiting from HealthSaathi's services. Access quality healthcare anytime, anywhere.
            </p>
            <Link to="/login">
              <Button 
                size="lg" 
                className="bg-white text-emerald-700 hover:bg-gray-100"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;