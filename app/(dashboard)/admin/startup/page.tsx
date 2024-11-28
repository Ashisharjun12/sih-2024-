import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FormSubmission from "@/models/form-submission.model";
import { connectDB } from "@/lib/db";

interface StartupSubmission {
  _id: string;
  userEmail: string;
  status: string;
  formType: string;
  formData: {
    companyName: string;
    description: string;
    industry: string;
    stage: string;
    teamSize?: string;
    location?: string;
    website?: string;
  };
  createdAt: string;
}

async function getStartupSubmissions() {
  try {
    await connectDB();
    
    // Find all startup form submissions
    const startups = await FormSubmission.find({
      formType: "startup"
    }).lean();

    return JSON.parse(JSON.stringify(startups)) as StartupSubmission[];
  } catch (error) {
    console.error('Error fetching startups:', error);
    return [];
  }
}

export default async function AdminStartupPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const startups = await getStartupSubmissions();

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Startup Management</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all startup submissions
        </p>
      </div>

      {/* Startups Grid */}
      <div className="grid grid-cols-1 gap-6">
        {startups.map((startup) => (
          <Card 
            key={startup._id}
            className="hover:shadow-lg transition-all duration-200"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{startup.formData.companyName}</CardTitle>
                  <CardDescription>
                    Submitted by: {startup.userEmail}
                  </CardDescription>
                </div>
                <Badge 
                  variant={
                    startup.status === "approved" ? "default" :
                    startup.status === "pending" ? "secondary" : "destructive"
                  }
                  className="capitalize"
                >
                  {startup.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Description */}
                <p className="text-sm text-muted-foreground">
                  {startup.formData.description}
                </p>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Created: </span>
                    {new Date(startup.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stage: </span>
                    {startup.formData.stage}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {startup.formData.industry}
                  </Badge>
                  {startup.formData.teamSize && (
                    <Badge variant="outline">
                      Team: {startup.formData.teamSize}
                    </Badge>
                  )}
                  {startup.formData.location && (
                    <Badge variant="outline">
                      {startup.formData.location}
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <Link 
                    href={`/admin/forms/${startup._id}`} 
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  {startup.status === "pending" && (
                    <Link 
                      href={`/admin/forms/${startup._id}/review`}
                      className="flex-1"
                    >
                      <Button className="w-full">
                        Review Submission
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {startups.length === 0 && (
          <Card className="text-center p-12">
            <CardContent>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No startups found</h3>
                <p className="text-muted-foreground">
                  There are no startup submissions yet
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
 