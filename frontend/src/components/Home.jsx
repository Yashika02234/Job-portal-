import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CategoryCarousel from './CategoryCarousel'
import HeroSection from './HeroSection'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import Navbar from './shared/Navbar'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, []);
  return (
    <>
      <Navbar />
      <div className="mt-20">
        <HeroSection />
        <CategoryCarousel />
        <LatestJobs />
      </div>
      <Footer />
    </>
  );
};

export default Home
