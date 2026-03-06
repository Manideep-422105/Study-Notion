import "./App.css";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import NavBar from "./Components/common/NavBar";
import Footer from "./Components/common/Footer";
import LoadingBar from "react-top-loading-bar";
import { setProgress } from "./slices/loadingBarSlice";
import "video-react/dist/video-react.css";
import { useSelector, useDispatch } from "react-redux";
import OpenRoute from "./Components/core/Auth/OpenRoute";
import PrivateRoute from "./Components/core/Auth/PrivateRoute";
import { ACCOUNT_TYPE } from "./utils/constants";
import ScrollToTop from "./Components/ScrollToTop";
import { RiWifiOffLine } from "react-icons/ri";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const About = lazy(() => import("./pages/About"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyProfile = lazy(() => import("./Components/core/Dashboard/MyProfile"));
const Setting = lazy(() => import("./Components/core/Dashboard/Settings"));
const EnrollledCourses = lazy(() => import("./Components/core/Dashboard/EnrolledCourses"));
const Cart = lazy(() => import("./Components/core/Dashboard/Cart/index"));
const AddCourse = lazy(() => import("./Components/core/Dashboard/AddCourse/index"));
const MyCourses = lazy(() => import("./Components/core/Dashboard/MyCourses/MyCourses"));
const EditCourse = lazy(() => import("./Components/core/Dashboard/EditCourse.jsx/EditCourse"));
const Catalog = lazy(() => import("./pages/Catalog"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const SearchCourse = lazy(() => import("./pages/SearchCourse"));
const ViewCourse = lazy(() => import("./pages/ViewCourse"));
const VideoDetails = lazy(() => import("./Components/core/ViewCourse/VideoDetails"));
const PurchaseHistory = lazy(() => import("./Components/core/Dashboard/PurchaseHistory"));
const InstructorDashboard = lazy(() => import("./Components/core/Dashboard/InstructorDashboard/InstructorDashboard"));
const AdminPannel = lazy(() => import("./Components/core/Dashboard/AdminPannel"));

function App() {
  console.log = function () { };
  const user = useSelector((state) => state.profile.user);
  const progress = useSelector((state) => state.loadingBar);
  const dispatch = useDispatch();
  return (
    <div className=" w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <LoadingBar
        color="#FFD60A"
        height={1.4}
        progress={progress}
        onLoaderFinished={() => dispatch(setProgress(0))}
      />
      <NavBar setProgress={setProgress}></NavBar>
      {!navigator.onLine && (
        <div className="bg-red-500 flex text-white text-center p-2 bg-richblack-300 justify-center gap-2 items-center">
          <RiWifiOffLine size={22} />
          Please check your internet connection.
          <button
            className="ml-2 bg-richblack-500 rounded-md p-1 px-2 text-white"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      <ScrollToTop />
      <Suspense fallback={<div className="mt-24 text-center text-richblack-5 text-2xl">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/catalog/:catalog" element={<Catalog />} />

          <Route
            path="/login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/update-password/:id" element={<ResetPassword />} />

          <Route path="/verify-email" element={<VerifyOtp />} />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<ContactUs />} />

          <Route path="/courses/:courseId" element={<CourseDetails />} />

          <Route path="/search/:searchQuery" element={<SearchCourse />} />

          <Route
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route path="dashboard/my-profile" element={<MyProfile />} />
            <Route path="dashboard/settings" element={<Setting />} />
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/cart" element={<Cart />} />
                <Route
                  path="dashboard/enrolled-courses"
                  element={<EnrollledCourses />}
                />
                <Route
                  path="dashboard/purchase-history"
                  element={<PurchaseHistory />}
                />
              </>
            )}
            {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/add-course" element={<AddCourse />} />
                <Route path="dashboard/my-courses" element={<MyCourses />} />
                <Route
                  path="dashboard/edit-course/:courseId"
                  element={<EditCourse />}
                />
                <Route
                  path="dashboard/instructor"
                  element={<InstructorDashboard />}
                />
              </>
            )}
            {user?.accountType === ACCOUNT_TYPE.ADMIN && (
              <>
                <Route path="dashboard/admin-panel" element={<AdminPannel />} />
              </>
            )}
          </Route>

          <Route
            element={
              <PrivateRoute>
                <ViewCourse />
              </PrivateRoute>
            }
          >
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route
                  path="/dashboard/enrolled-courses/view-course/:courseId/section/:sectionId/sub-section/:subsectionId"
                  element={<VideoDetails />}
                />
              </>
            )}
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
