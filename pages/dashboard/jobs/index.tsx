import React, { ReactElement, useState } from "react";
import DashboardLayout from "../layout";
import JobListComponent, {
  Job,
} from "@/pages/dashboard/jobs/components/JobList";
import { useRouter } from "next/router";
import JobForm from "./components/JobForm";

const JobsPage = () => {
  const router = useRouter();
  const { action } = router.query; // Access action query parameter
  console.log(action);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <>
      {action === "new" || action === "edit" ? (
        <JobForm selectedJob={selectedJob} /> // Render JobForm if action is "new"
      ) : (
        <JobListComponent setSelectedJob={setSelectedJob} /> // Render JobListComponent otherwise
      )}
    </>
  );
};

JobsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default JobsPage;
