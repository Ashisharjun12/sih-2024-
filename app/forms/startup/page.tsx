"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { X, Plus } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Define steps
const steps = [
  {
    id: 1,
    title: "Owner Details",
    description: "Basic information about the owner"
  },
  {
    id: 2,
    title: "Startup Details",
    description: "Information about your startup"
  }
];

// Add these interfaces at the top of the file
interface StepProps {
  form: any; // Replace with proper form type
  handleFileChange: (fileData: { file: File | null; uploadData?: any }) => void;
  handleFileUpload: (file: File | null, fileType: string) => void;
  isUploading: boolean;
}

// Add before the main component
const OwnerDetailsStep = ({ form, handleFileChange, handleFileUpload, isUploading }: StepProps) => {
  return (
    <div className="space-y-6">
      {/* Owner's Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <FormField
          control={form.control}
          name="owner.fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your full name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="owner.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter your email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your phone number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Business Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Business Address</h3>
        
        <FormField
          control={form.control}
          name="owner.businessAddress.physicalAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter street address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="owner.businessAddress.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter city" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner.businessAddress.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter state" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="owner.businessAddress.pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pincode</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter pincode" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Identity Documents */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Identity Documents</h3>
        <FormItem>
          {/* <FormLabel>Identity Proof</FormLabel> */}
          <FileUpload
            label="Upload Identity Proof"
            fileType="identityProof"
            accept=".pdf,.jpg,.jpeg,.png"
            onFileChange={(fileData) => handleFileUpload(fileData.file, 'identityProof')}
            isUploading={isUploading}
          />
        </FormItem>
      </div>
    </div>
  );
};

// Add this interface for license type
interface License {
  type: string;
  number: string;
  validUntil: string;
}

// Add these arrays at the top of the file
const industryOptions = [
  'Advertising',
  'Aeronautics Aerospace & Defence',
  'Agriculture',
  'AI',
  'Airport Operations',
  'Analytics',
  'Animation',
  'AR VR (Augmented + Virtual Reality)',
  'Architecture Interior Design',
  'Art & Photography',
  'Automotive',
  'Biotechnology',
  'Chemicals',
  'Computer Vision',
  'Construction',
  'Dating Matrimonial',
  'Design',
  'Education',
  'Enterprise Software',
  'Events',
  'Fashion',
  'Finance Technology',
  'Food & Beverages',
  'Green Technology',
  'Healthcare & Lifesciences',
  'House-Hold Services',
  'Human Resources',
  'Indic Language Startups',
  'Internet of Things',
  'IT Services',
  'Logistics',
  'Marketing',
  'Media & Entertainment',
  'Nanotechnology',
  'Non- Renewable Energy',
  'Other Specialty Retailers',
  'Others',
  'Passenger Experience',
  'Pets & Animals',
  'Professional & Commercial Services',
  'Real Estate',
  'Renewable Energy',
  'Retail',
  'Robotics',
  'Safety',
  'Security Solutions',
  'Social Impact',
  'Social Network',
  'Sports',
  'Technology Hardware',
  'Telecommunication & Networking',
  'Textiles & Apparel',
  'Toys and Games',
  'Transportation & Storage',
  'Travel & Tourism',
  'Waste Management'
];

const stageOptions = [
  { value: 'Ideation', label: 'Ideation' },
  { value: 'Validation', label: 'Validation' },
  { value: 'Scaling', label: 'Scaling' },
  { value: 'Expansion', label: 'Expansion' }
];

// Add sectorOptions array at the top with industryOptions
const sectorOptions =[
  '3d printing',
  'Accounting',
  'AdTech',
  'Advisory',
  'Agri-Tech',
  'Agricultural Chemicals',
  'Animal Husbandry',
  'Apparel',
  'Apparel & Accessories',
  'Application Development',
  'Art',
  'Assistance Technology',
  'Auto & Truck Manufacturers',
  'Auto Vehicles, Parts & Service Retailers',
  'Auto, Truck & Motorcycle Parts',
  'Aviation & Others',
  'Baby Care',
  'Big Data',
  'Billing and Invoicing',
  'Biotechnology',
  'Bitcoin and Blockchain',
  'BPO',
  'Branding',
  'Business Finance',
  'Business Intelligence',
  'Business Support Services',
  'Business Support Supplies',
  'Clean Tech',
  'Cloud',
  'Coaching',
  'Collaboration',
  'Commercial Printing Services',
  'Commodity Chemicals',
  'Comparison Shopping',
  'Computer & Electronics Retailers',
  'Construction & Engineering',
  'Construction Materials',
  'Construction Supplies & Fixtures',
  'Corporate Social Responsibility',
  'Coworking Spaces',
  'Crowdfunding',
  'Customer Support',
  'CXM',
  'Cyber Security',
  'Dairy Farming',
  'Data Science',
  'Defence Equipment',
  'Digital Marketing (SEO Automation)',
  'Digital Media',
  'Digital Media Blogging',
  'Digital Media News',
  'Digital Media Publishing',
  'Digital Media Video',
  'Discovery',
  'Diversified Chemicals',
  'Drones',
  'E-Commerce',
  'E-learning',
  'Education',
  'Education Technology',
  'Electric Vehicles',
  'Electronics',
  'Embedded',
  'Employment Services',
  'Enterprise Mobility',
  'Entertainment',
  'Environmental Services & Equipment',
  'ERP',
  'Events Management',
  'Experiential Travel',
  'Facility Management',
  'Fan Merchandise',
  'Fantasy Sports',
  'Fashion Technology',
  'Fisheries',
  'Food Processing',
  'Food Technology/Food Delivery',
  'Foreign Exchange',
  'Freight & Logistics Services',
  'Handicraft',
  'Health & Wellness',
  'Healthcare IT',
  'Healthcare Services',
  'Healthcare Technology',
  'Holiday Rentals',
  'Home Care',
  'Home Furnishings Retailers',
  'Home Improvement Products & Services Retailers',
  'Home Security solutions',
  'Homebuilding',
  'Horticulture',
  'Hospitality',
  'Hotel',
  'Housing',
  'Industrial Design',
  'Insurance',
  'Integrated communication services',
  'Internships',
  'IT Consulting',
  'IT Management',
  'Jewellery',
  'KPO',
  'Laundry',
  'Leather Footwear',
  'Leather Textiles Goods',
  'Lifestyle',
  'Location Based',
  'Loyalty',
  'Machine Learning',
  'Manufacture of Electrical Equipment',
  'Manufacture of Machinery and Equipment',
  'Manufacturing',
  'Manufacturing & Warehouse',
  'Market Research',
  'Media and Entertainment',
  'Medical Devices Biomedical',
  'Microbrewery',
  'Microfinance',
  'Mobile wallets Payments',
  'Movies',
  'Natural Language Processing',
  'Network Technology Solutions',
  'New-age Construction Technologies',
  'NGO',
  'NLP',
  'Non- Leather Footwear',
  'Non- Leather Textiles Goods',
  'Oil & Gas Drilling',
  'Oil & Gas Exploration and Production',
  'Oil & Gas Transportation Services',
  'Oil Related Services and Equipment',
  'Online Classified',
  'OOH Media',
  'Organic Agriculture',
  'Others',
  'P2P Lending',
  'Passenger Transportation Services',
  'Payment Platforms',
  'Personal Care',
  'Personal Finance',
  'Personal Security',
  'Pharmaceutical',
  'Photography',
  'Physical Toys and Games',
  'Point of Sales',
  'Product Development',
  'Professional Information Services',
  'Project Management',
  'Public Citizen Security Solutions',
  'Recruitment Jobs',
  'Renewable Energy Solutions',
  'Renewable Nuclear Energy',
  'Renewable Solar Energy',
  'Renewable Wind Energy',
  'Restaurants',
  'Retail Technology',
  'Robotics Application',
  'Robotics Technology',
  'Sales',
  'SCM',
  'Semiconductor',
  'Skill Development',
  'Skills Assessment',
  'Smart Home',
  'Social Commerce',
  'Social Media',
  'Social Media',
  'Space Technology',
  'Specialty Chemicals',
  'Sports Promotion and Networking',
  'Talent Management',
  'Testing',
  'Ticketing',
  'Tires & Rubber Products',
  'Trading',
  'Traffic Management',
  'Training',
  'Transport Infrastructure',
  'Utility Services',
  'Virtual Games',
  'Waste Management',
  'Wayside Amenities',
  'Wearables',
  'Web Design',
  'Web Development',
  'Weddings',
  'Wireless'
];

// Add this near the top of the file
interface FileUpload {
  public_id: string;
  secure_url: string;
}

// Update StartupDetailsStep component
const StartupDetailsStep = ({ form, handleFileChange, handleFileUpload, isUploading }: StepProps) => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const { toast } = useToast();

  const addLicense = () => {
    const newLicense: License = {
      type: "",
      number: "",
      validUntil: ""
    };
    setLicenses([...licenses, newLicense]);
  };

  const removeLicense = (index: number) => {
    setLicenses(licenses.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Basic Startup Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Startup Information</h3>
        
        <FormField
          control={form.control}
          name="startupDetails.startupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Startup Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter startup name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Startup Logo Upload */}
        <div className="space-y-2">
          <Label>Startup Logo</Label>
          <FormItem>
            <FormControl>
              <FileUpload
                label="Upload Logo"
                fileType="startupLogo"
                accept="image/*"
                onFileChange={(fileData) => handleFileUpload(fileData.file, 'startupLogo')}
                isUploading={isUploading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startupDetails.registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter registration number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startupDetails.incorporationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Incorporation Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Industry & Sector Information</h3>
          
          {/* Industries Multi-select */}
          <FormField
            control={form.control}
            name="startupDetails.industries"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industries</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    const currentValues = field.value || [];
                    if (!currentValues.includes(value)) {
                      field.onChange([...currentValues, value]);
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industries" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value?.map((industry: string) => (
                    <Badge 
                      key={industry}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {industry}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => {
                          field.onChange(field.value.filter((i: string) => i !== industry));
                        }}
                      />
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sectors Multi-select */}
          <FormField
            control={form.control}
            name="startupDetails.sectors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sectors</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    const currentValues = field.value || [];
                    if (!currentValues.includes(value)) {
                      field.onChange([...currentValues, value]);
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sectors" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sectorOptions.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value?.map((sector: string) => (
                    <Badge 
                      key={sector}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {sector}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => {
                          field.onChange(field.value.filter((s: string) => s !== sector));
                        }}
                      />
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Documents</h3>
        
        <div className="space-y-2">
          <FormItem>
          <FileUpload
            label="Upload Pitch Deck"
            fileType="pitchDeck"
            accept=".pdf,.jpg,.jpeg,.png"
            onFileChange={(fileData) => handleFileUpload(fileData.file, 'pitchDeck')}
            isUploading={isUploading}
          />
        </FormItem>
        </div>

        <div className="space-y-2">
          <FormItem>
          <FileUpload
            label="Upload Certificate"
            fileType="incorporationCertificate"
            accept=".pdf,.jpg,.jpeg,.png"
            onFileChange={(fileData) => handleFileUpload(fileData.file, 'incorporationCertificate')}
            isUploading={isUploading}
          />
          </FormItem>
        </div>
        
      </div>

      {/* Mission & Vision */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Business Activities</h3>
        
        <FormField
          control={form.control}
          name="businessActivities.missionAndVision"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mission & Vision</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your startup's mission and vision" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Legal & Compliance */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Legal & Compliance</h3>
        
        <FormField
          control={form.control}
          name="legalAndCompliance.gstin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GSTIN</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter GSTIN number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Licenses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Licenses</h4>
            <Button type="button" variant="outline" size="sm" onClick={addLicense}>
              <Plus className="h-4 w-4 mr-2" />
              Add License
            </Button>
          </div>

          {licenses.map((_, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 items-start">
              <FormField
                control={form.control}
                name={`legalAndCompliance.licenses.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select license type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FSSAI">FSSAI</SelectItem>
                        <SelectItem value="Drug_License">Drug License</SelectItem>
                        <SelectItem value="AYUSH">AYUSH</SelectItem>
                        <SelectItem value="Import_Export">Import/Export</SelectItem>
                        <SelectItem value="Shop_Establishment">Shop Establishment</SelectItem>
                        <SelectItem value="Trade_License">Trade License</SelectItem>
                        <SelectItem value="Factory_License">Factory License</SelectItem>
                        <SelectItem value="ESI_Registration">ESI Registration</SelectItem>
                        <SelectItem value="PF_Registration">PF Registration</SelectItem>
                        <SelectItem value="Professional_Tax">Professional Tax</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`legalAndCompliance.licenses.${index}.number`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter license number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-end gap-2">
                <FormField
                  control={form.control}
                  name={`legalAndCompliance.licenses.${index}.validUntil`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Valid Until</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLicense(index)}
                  className="mb-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Fundraising Status */}
        <FormField
          control={form.control}
          name="isActivelyFundraising"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4"
                />
              </FormControl>
              <FormLabel className="!mt-0">Actively seeking funding</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>


      {/* Social Media Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Online Presence</h3>
        
        <FormField
          control={form.control}
          name="additionalInfo.website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter website URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="additionalInfo.socialMedia.linkedIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="LinkedIn profile" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalInfo.socialMedia.facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Facebook page" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalInfo.socialMedia.twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Twitter handle" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* About Startup */}
      <FormField
        control={form.control}
        name="startupDetails.about"
        render={({ field }) => (
          <FormItem>
            <FormLabel>About Startup</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Describe your startup" 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Founders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Founders</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const currentFounders = form.getValues("startupDetails.founders") || [];
              form.setValue("startupDetails.founders", [
                ...currentFounders,
                { name: "", role: "", contactDetails: "" }
              ]);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Founder
          </Button>
        </div>

        {form.watch("startupDetails.founders")?.map((founder: Founder, index: number) => (
          <div key={index} className="grid grid-cols-3 gap-4 items-start">
            <FormField
              control={form.control}
              name={`startupDetails.founders.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Founder name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`startupDetails.founders.${index}.role`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. CEO, CTO" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name={`startupDetails.founders.${index}.contactDetails`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Contact Details</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email or phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mb-2"
                onClick={() => {
                  const currentFounders = form.getValues("startupDetails.founders");
                  form.setValue("startupDetails.founders", 
                    currentFounders.filter((_: Founder, i: number) => i !== index)
                  );
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Equity Split Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Equity Split</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const currentSplits = form.getValues("startupDetails.equitySplits") || [];
              form.setValue("startupDetails.equitySplits", [
                ...currentSplits,
                { ownerName: "", equityPercentage: 0 }
              ]);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Equity Split
          </Button>
        </div>

        {form.watch("startupDetails.equitySplits")?.map((split: EquitySplit, index: number) => (
          <div key={index} className="grid grid-cols-2 gap-4 items-start">
            <FormField
              control={form.control}
              name={`startupDetails.equitySplits.${index}.ownerName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Owner name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name={`startupDetails.equitySplits.${index}.equityPercentage`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Equity Percentage</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="0-100"
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mb-2"
                onClick={() => {
                  const currentSplits = form.getValues("startupDetails.equitySplits");
                  form.setValue("startupDetails.equitySplits", 
                    currentSplits.filter((_: EquitySplit, i: number) => i !== index)
                  );
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface Founder {
  name: string;
  role: string;
  contactDetails: string;
}

interface EquitySplit {
  ownerName: string;
  equityPercentage: number;
}

export default function StartupRegistrationForm() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState<Record<string, any>>({});
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    defaultValues: {
      owner: {
        fullName: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: "",
        businessAddress: {
          physicalAddress: "",
          city: "",
          state: "",
          pincode: ""
        },
        dateOfBirth: "",
        gender: "Male"
      },
      startupDetails: {
        startupName: "",
        startupLogo: {
          public_id: "",
          secure_url: ""
        },
        about: "",
        industries: [],
        sectors: [],
        stage: "Ideation",
        registrationNumber: "",
        incorporationDate: "",
        businessModel: "B2B",
        revenueModel: "Subscription",
        founders: [],
        equitySplits: []
      },
      businessActivities: {
        missionAndVision: ""
      },
      legalAndCompliance: {
        gstin: "",
        licenses: []
      },
      isActivelyFundraising: false,
      additionalInfo: {
        website: "",
        socialMedia: {
          linkedIn: "",
          facebook: "",
          twitter: ""
        },
        pitchDeck: {
          public_id: "",
          secure_url: ""
        },
        identityProof: {
          public_id: "",
          secure_url: ""
        },
        incorporationCertificate: {
          public_id: "",
          secure_url: ""
        }
      }
    }
  });

  const handleFileChange = (fileData: { file: File | null; uploadData?: any }) => {
    if (!fileData.uploadData?.fileType) return;
    
    setFiles(prev => ({
      ...prev,
      [fileData.uploadData.fileType]: {
        file: fileData.file,
        uploadData: fileData.uploadData
      }
    }));
  };

  const handleFileUpload = async (file: File | null, fileType: string) => {
    if (!file) return;

    console.log("Starting file upload:", { fileType, fileName: file.name });
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Sending upload request...");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Upload response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Upload failed:", errorData);
        throw new Error(`Failed to upload ${file.name}`);
      }

      const uploadedFile = await response.json();
      console.log("Upload successful, received data:", uploadedFile);

      handleFileChange({
        file,
        uploadData: {
          ...uploadedFile,
          fileType,
          originalName: file.name
        }
      });
      console.log("Files:", files);

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      console.log("Files:", files);

      // Prepare form data with files
      const formData = {
        ...data,
        files: Object.entries(files).reduce((acc, [key, value]) => {
          if (value?.uploadData) {
            acc[key] = {
              public_id: value.uploadData.public_id,
              secure_url: value.uploadData.secure_url
            };
          }
          return acc;
        }, {} as Record<string, any>)
      };


      console.log("Form Data:", formData);

      const response = await fetch("/api/forms/startup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData })
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast({
        title: "Success",
        description: "Your startup registration has been submitted for review"
      });

      // router.push("/dashboard");

    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit form",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setCurrentStep(2);
  };
  const prevStep = () => setCurrentStep(1);

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Startup Registration</CardTitle>
          {/* Step Indicator */}
          <div className="mt-4">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
                    ${currentStep >= step.id ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>
                    {step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 w-24 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <div key={step.id} className="text-sm">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {currentStep === 1 ? (
                // Step 1: Owner Details
                <OwnerDetailsStep 
                  form={form} 
                  handleFileChange={handleFileChange}
                  handleFileUpload={handleFileUpload}
                  isUploading={isUploading}
                />
              ) : (
                // Step 2: Startup Details
                <StartupDetailsStep 
                  form={form} 
                  handleFileChange={handleFileChange}
                  handleFileUpload={handleFileUpload}
                  isUploading={isUploading}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                {currentStep === 2 && (
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={prevStep}
                  >
                    Previous
                  </Button>
                )}
                {currentStep === 1 ? (
                  <Button 
                    type="button"
                    onClick={nextStep}
                    className="ml-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
