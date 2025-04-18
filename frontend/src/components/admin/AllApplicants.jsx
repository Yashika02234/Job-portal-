import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBuilding, FaCalendarAlt, FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AllApplicants = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allApplicants, setAllApplicants] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs/admin');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setAllJobs(data);
        
        // Extract all applicants from all jobs
        const applicantsArray = [];
        data.forEach(job => {
          if (job.applicants && job.applicants.length > 0) {
            job.applicants.forEach(applicant => {
              applicantsArray.push({
                ...applicant,
                jobTitle: job.title,
                jobId: job._id
              });
            });
          }
        });
        
        // Sort by application date (newest first)
        applicantsArray.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
        setAllApplicants(applicantsArray);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-5">
          <div className="mb-6">
            <Link to="/admin/analytics" className="inline-flex items-center text-blue-400 hover:text-blue-300">
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold mt-3 mb-6">All Applicants</h1>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900 text-white p-4 rounded-md">
              <p>{error}</p>
            </div>
          ) : allApplicants.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-xl">No applicants found.</p>
              <p className="mt-2 text-gray-400">Post a job to receive applications.</p>
              <Link to="/admin/post-job" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {allApplicants.map((applicant, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-5 hover:bg-gray-750 transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center mb-3 md:mb-0">
                      <div className="bg-gray-700 p-3 rounded-full mr-4">
                        <FaUser className="text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{applicant.name}</h3>
                        <p className="text-gray-400">{applicant.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className="bg-gray-700 px-3 py-1 rounded-full flex items-center">
                        <FaBuilding className="mr-2 text-blue-400" />
                        <span className="text-sm">{applicant.jobTitle}</span>
                      </div>
                      <div className="bg-gray-700 px-3 py-1 rounded-full flex items-center">
                        <FaCalendarAlt className="mr-2 text-blue-400" />
                        <span className="text-sm">{formatDate(applicant.appliedAt || new Date())}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      {applicant.resumeUrl && (
                        <a 
                          href={applicant.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center text-blue-400 hover:text-blue-300 mr-4"
                        >
                          <FaFileAlt className="mr-1" /> View Resume
                        </a>
                      )}
                    </div>
                    <Link 
                      to={`/admin/jobs/${applicant.jobId}/applicants`} 
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Job Applicants
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllApplicants; 