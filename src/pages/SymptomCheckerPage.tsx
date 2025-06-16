import React, { useState } from 'react';
import { PlusCircle, ArrowRight, AlertCircle, Check, HelpCircle, Phone } from 'lucide-react';
import Card, { CardHeader, CardBody, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import { SymptomCheckerResult } from '../types';
import translations from '../utils/translations';

// Mock symptom data
const SYMPTOMS = [
  { id: 's1', name: 'Fever', description: 'High body temperature' },
  { id: 's2', name: 'Cough', description: 'Persistent coughing' },
  { id: 's3', name: 'Headache', description: 'Pain in the head or neck region' },
  { id: 's4', name: 'Fatigue', description: 'Feeling of tiredness or exhaustion' },
  { id: 's5', name: 'Sore throat', description: 'Pain or irritation in the throat' },
  { id: 's6', name: 'Runny nose', description: 'Nasal discharge' },
  { id: 's7', name: 'Shortness of breath', description: 'Difficulty breathing' },
  { id: 's8', name: 'Muscle ache', description: 'Pain in muscles' },
  { id: 's9', name: 'Loss of taste or smell', description: 'Reduced ability to taste or smell' },
  { id: 's10', name: 'Nausea', description: 'Feeling sick to your stomach' },
  { id: 's11', name: 'Vomiting', description: 'Forceful expulsion of stomach contents' },
  { id: 's12', name: 'Diarrhea', description: 'Loose, watery bowel movements' },
  { id: 's13', name: 'Rash', description: 'Skin irritation or discoloration' },
  { id: 's14', name: 'Dizziness', description: 'Feeling lightheaded or unsteady' },
];

// Mock body parts for symptom selection
const BODY_PARTS = [
  { id: 'head', name: 'Head', symptoms: ['s1', 's3', 's5', 's6', 's9'] },
  { id: 'chest', name: 'Chest', symptoms: ['s2', 's7'] },
  { id: 'abdomen', name: 'Abdomen', symptoms: ['s10', 's11', 's12'] },
  { id: 'limbs', name: 'Arms & Legs', symptoms: ['s8', 's13'] },
  { id: 'general', name: 'General', symptoms: ['s1', 's4', 's14'] },
];

// Mock results based on symptom combinations
const mockAnalyzeSymptoms = (symptoms: string[]): SymptomCheckerResult => {
  // Contains fever and cough and shortness of breath
  if (symptoms.includes('s1') && symptoms.includes('s2') && symptoms.includes('s7')) {
    return {
      possibleConditions: [
        {
          name: 'COVID-19',
          probability: 0.8,
          urgency: 'high',
          description: 'A respiratory illness caused by the SARS-CoV-2 virus.'
        },
        {
          name: 'Pneumonia',
          probability: 0.6,
          urgency: 'high',
          description: 'An infection that inflames the air sacs in one or both lungs.'
        },
        {
          name: 'Bronchitis',
          probability: 0.4,
          urgency: 'medium',
          description: 'Inflammation of the lining of bronchial tubes.'
        }
      ],
      recommendedAction: 'consult',
    };
  }
  
  // Contains headache and fever
  if (symptoms.includes('s3') && symptoms.includes('s1')) {
    return {
      possibleConditions: [
        {
          name: 'Viral Fever',
          probability: 0.7,
          urgency: 'medium',
          description: 'A fever caused by a viral infection.'
        },
        {
          name: 'Influenza',
          probability: 0.5,
          urgency: 'medium',
          description: 'A contagious respiratory illness caused by influenza viruses.'
        },
        {
          name: 'Dengue Fever',
          probability: 0.3,
          urgency: 'high',
          description: 'A mosquito-borne viral disease.'
        }
      ],
      recommendedAction: 'consult',
    };
  }
  
  // Contains nausea, vomiting, diarrhea
  if (symptoms.includes('s10') && (symptoms.includes('s11') || symptoms.includes('s12'))) {
    return {
      possibleConditions: [
        {
          name: 'Food Poisoning',
          probability: 0.8,
          urgency: 'medium',
          description: 'Illness caused by eating contaminated food.'
        },
        {
          name: 'Gastroenteritis',
          probability: 0.7,
          urgency: 'medium',
          description: 'Inflammation of the stomach and intestines.'
        },
        {
          name: 'Stomach Flu',
          probability: 0.5,
          urgency: 'low',
          description: 'A viral infection that attacks your digestive system.'
        }
      ],
      recommendedAction: 'selfCare',
      selfCareSteps: [
        'Stay hydrated with water, clear broths, or oral rehydration solutions',
        'Rest and avoid solid foods until symptoms improve',
        'Gradually reintroduce bland foods like rice, toast, and bananas',
        'Avoid dairy products, caffeine, alcohol, and fatty foods',
        'Seek medical help if symptoms persist for more than 2 days or if you become severely dehydrated'
      ]
    };
  }
  
  // Default response for other symptom combinations
  return {
    possibleConditions: [
      {
        name: 'Common Cold',
        probability: 0.6,
        urgency: 'low',
        description: 'A viral infection of your nose and throat.'
      },
      {
        name: 'Seasonal Allergies',
        probability: 0.4,
        urgency: 'low',
        description: 'An immune system response to an allergen like pollen.'
      }
    ],
    recommendedAction: 'selfCare',
    selfCareSteps: [
      'Rest and drink plenty of fluids',
      'Take over-the-counter pain relievers if needed',
      'Use a humidifier to add moisture to the air',
      'Monitor your symptoms and consult a doctor if they worsen'
    ]
  };
};

const SymptomCheckerPage = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>('');
  const [severity, setSeverity] = useState<string>('');
  const [result, setResult] = useState<SymptomCheckerResult | null>(null);
  
  const { language } = useHealthSaathi();
  const t = translations[language];

  const handleSelectBodyPart = (partId: string) => {
    if (selectedBodyParts.includes(partId)) {
      setSelectedBodyParts(selectedBodyParts.filter(id => id !== partId));
    } else {
      setSelectedBodyParts([...selectedBodyParts, partId]);
    }
  };

  const handleSelectSymptom = (symptomId: string) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    }
  };

  const handleAnalyzeSymptoms = () => {
    // In a real app, this would send data to a backend for AI analysis
    const analysisResult = mockAnalyzeSymptoms(selectedSymptoms);
    setResult(analysisResult);
    setStep(4);
  };

  const resetSymptomChecker = () => {
    setSelectedBodyParts([]);
    setSelectedSymptoms([]);
    setDuration('');
    setSeverity('');
    setResult(null);
    setStep(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.symptomChecker}</h1>
          <p className="text-gray-600">
            Answer a few questions to understand what might be causing your symptoms
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 4</span>
            <span className="text-sm text-gray-500">{step * 25}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${step * 25}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Select Body Region */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-800">Where are you experiencing symptoms?</h2>
              <p className="text-gray-600 text-sm">Select all areas that apply</p>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BODY_PARTS.map(part => (
                  <div 
                    key={part.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedBodyParts.includes(part.id) 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => handleSelectBodyPart(part.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedBodyParts.includes(part.id) 
                          ? 'border-indigo-500 bg-indigo-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedBodyParts.includes(part.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="ml-3 font-medium">{part.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
            <CardFooter>
              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={selectedBodyParts.length === 0}
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  Continue
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Select Symptoms */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-800">What symptoms are you experiencing?</h2>
              <p className="text-gray-600 text-sm">Select all that apply</p>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SYMPTOMS
                  .filter(symptom => {
                    // Show symptoms related to selected body parts
                    return selectedBodyParts.some(partId => {
                      const part = BODY_PARTS.find(p => p.id === partId);
                      return part?.symptoms.includes(symptom.id);
                    });
                  })
                  .map(symptom => (
                    <div 
                      key={symptom.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedSymptoms.includes(symptom.id) 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                      onClick={() => handleSelectSymptom(symptom.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{symptom.name}</span>
                          <p className="text-sm text-gray-500">{symptom.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selectedSymptoms.includes(symptom.id) 
                            ? 'border-indigo-500 bg-indigo-500' 
                            : 'border-gray-300'
                        }`}>
                          {selectedSymptoms.includes(symptom.id) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>

              {/* No symptoms available message */}
              {SYMPTOMS.filter(symptom => {
                return selectedBodyParts.some(partId => {
                  const part = BODY_PARTS.find(p => p.id === partId);
                  return part?.symptoms.includes(symptom.id);
                });
              }).length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No symptoms available for the selected body parts.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setStep(1)}>
                    Go Back
                  </Button>
                </div>
              )}
            </CardBody>
            <CardFooter>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={selectedSymptoms.length === 0}
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  Continue
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Additional Information */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-800">Tell us more about your symptoms</h2>
              <p className="text-gray-600 text-sm">This helps us provide more accurate information</p>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    How long have you been experiencing these symptoms?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Less than 24 hours', '1-3 days', 'More than 3 days'].map((option) => (
                      <div
                        key={option}
                        className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                          duration === option 
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                        onClick={() => setDuration(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    How severe are your symptoms?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Mild', 'Moderate', 'Severe'].map((option) => (
                      <div
                        key={option}
                        className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                          severity === option 
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                        onClick={() => setSeverity(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-700 font-medium">Important Notice</p>
                      <p className="text-yellow-600 text-sm mt-1">
                        This symptom checker is for informational purposes only and is not a qualified medical opinion. 
                        Always consult with a healthcare professional for medical advice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleAnalyzeSymptoms} 
                  disabled={!duration || !severity}
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  Analyze Symptoms
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {/* Step 4: Results */}
        {step === 4 && result && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-800">Symptom Analysis</h2>
                <p className="text-gray-600 text-sm">Based on the information you provided</p>
              </CardHeader>
              <CardBody>
                <div className="space-y-6">
                  {/* Recommended Action */}
                  <div className={`p-4 rounded-lg ${
                    result.recommendedAction === 'emergency' 
                      ? 'bg-red-50' 
                      : result.recommendedAction === 'consult' 
                        ? 'bg-yellow-50' 
                        : 'bg-green-50'
                  }`}>
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full mr-4 ${
                        result.recommendedAction === 'emergency' 
                          ? 'bg-red-100' 
                          : result.recommendedAction === 'consult' 
                            ? 'bg-yellow-100' 
                            : 'bg-green-100'
                      }`}>
                        <AlertCircle className={`h-6 w-6 ${
                          result.recommendedAction === 'emergency' 
                            ? 'text-red-600' 
                            : result.recommendedAction === 'consult' 
                              ? 'text-yellow-600' 
                              : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${
                          result.recommendedAction === 'emergency' 
                            ? 'text-red-700' 
                            : result.recommendedAction === 'consult' 
                              ? 'text-yellow-700' 
                              : 'text-green-700'
                        }`}>
                          {result.recommendedAction === 'emergency' 
                            ? 'Seek Emergency Care' 
                            : result.recommendedAction === 'consult' 
                              ? 'Consult with a Doctor' 
                              : 'Self-Care Recommended'}
                        </h3>
                        <p className={`mt-1 ${
                          result.recommendedAction === 'emergency' 
                            ? 'text-red-600' 
                            : result.recommendedAction === 'consult' 
                              ? 'text-yellow-600' 
                              : 'text-green-600'
                        }`}>
                          {result.recommendedAction === 'emergency' 
                            ? 'Your symptoms suggest you need immediate medical attention.' 
                            : result.recommendedAction === 'consult' 
                              ? 'Based on your symptoms, we recommend you speak with a healthcare provider.' 
                              : 'Your symptoms can likely be managed at home with proper care.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Possible Conditions */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Possible Conditions</h3>
                    <div className="space-y-3">
                      {result.possibleConditions.map((condition, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{condition.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              condition.urgency === 'high' 
                                ? 'bg-red-100 text-red-800' 
                                : condition.urgency === 'medium' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              {condition.urgency === 'high' 
                                ? 'High Urgency' 
                                : condition.urgency === 'medium' 
                                  ? 'Medium Urgency' 
                                  : 'Low Urgency'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{condition.description}</p>
                          <div className="mt-2">
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 mr-2">Match:</span>
                              <div className="w-full bg-gray-200 rounded-full h-2 max-w-[200px]">
                                <div 
                                  className="bg-indigo-600 h-2 rounded-full" 
                                  style={{ width: `${condition.probability * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 ml-2">
                                {Math.round(condition.probability * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Self-Care Steps */}
                  {result.recommendedAction === 'selfCare' && result.selfCareSteps && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Self-Care Recommendations</h3>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <ul className="space-y-2">
                          {result.selfCareSteps.map((step, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-green-800">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                    <p className="font-medium text-gray-700 mb-1">Disclaimer</p>
                    <p>
                      This symptom checker provides general health information and is not a substitute for professional 
                      medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified 
                      health provider with any questions you may have regarding a medical condition.
                    </p>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={resetSymptomChecker}
                    fullWidth
                  >
                    Start Over
                  </Button>
                  
                  {result.recommendedAction !== 'selfCare' && (
                    <Button 
                      variant="primary"
                      icon={<Phone className="h-4 w-4" />}
                      fullWidth
                    >
                      Consult a Doctor
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomCheckerPage;