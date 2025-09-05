import React from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { AnimatePresence, motion, number } from 'framer-motion';
import{ LuCircleAlert, LuList, LuListCollapse } from 'react-icons/lu';
//import SpinnerLoader from '../../components/Loaders/SpinnerLoader';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import RoleInfoHeader from './components/RoleInfoHeader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import QuestionCard from '../../components/Cards/QuestionCard';
import AIResponsePreview from './components/AIResponsePreview';
import Drawer from '../../components/Drawer';
import SkeletonLoader from '../../components/Loader/SkeletonLoader';

const InterviewPrep = () => {

  const { sessionId } = useParams();

  const [sessionDate, setSessionDate] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");


  const [openLeanMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  // fetch session data by session id.
  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );

      if (response.data && response.data.session) {
        setSessionDate(response.data.session);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Generate concept explanation using AI.
  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);

      setIsLoading(true);
      setOpenLearnMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        {
          question
        }
      );

      if (response.data) {
        setExplanation(response.data);
      }
    } catch (error) {
      setExplanation(null);
      setErrorMsg("Failed to generate explanation. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //Pin question.
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId)
      );

      console.log(response);

      if (response.data && response.data.question) {
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Add more question to a sssion.
  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);

      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionDate?.role,
          experience: sessionDate?.experience,
          topicsToFocus: sessionDate?.topicsToFocus,
          numberOfQuestions: 10,
        }
      );

      const generatedQuestions = aiResponse.data;

      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
          questions: generatedQuestions,
        }
      );

      if (response.data) {
        toast.success("Added more Q&A!!");
        fetchSessionDetailsById();
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }

    return () => {};
  }, []);

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionDate?.role || ""}
        topicsToFocus={sessionDate?.topicsToFocus || ""}
        experience={sessionDate?.experience || "-"}
        questions={sessionDate?.questions?.length || "-"}
        description={sessionDate?.description || ""}
        lastUpdated={
          sessionDate?.updatedAt
            ? moment(sessionDate.updatedAt).format("DD MMM, YYYY")
            : ""
        }
      />

      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className="text-lg font-semibold color-black">Interview Q & A</h2>

        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div
            className={`col-span-12 ${
              openLeanMoreDrawer ? "md:col-span-7" : "md:col-span-8"
              } `}
          >
            <AnimatePresence>
              {sessionDate?.questions?.map((data, index) => {
                return (
                  <motion.div
                  key={data.id || index}
                  initial={{opacity:0, y:-20}}
                  animate={{opacity:1, y:0}}
                  exit={{opacity:0, scale:0.95}}
                  transition={{
                    duration:0.4,
                    type:"spring",
                    stiffness:100,
                    delay: index * 0.1,
                    damping: 15,
                  }}
                  layout
                  layoutId={`question-${data.id || index}`}
                  >
                    <>
                    <QuestionCard
                      question={data?.question}
                      answer={data?.answer}
                      onLearnMore={() => generateConceptExplanation(data.question)}
                      isPinned={data?.isPinned}
                      onTogglePin={() => toggleQuestionPinStatus(data.id)}
                    />
                    

                      {!isLoading && 
                      sessionDate?.questions?.length == index + 1 && (
                        <div className="flex items-center justify-center mt-5">
                          <button
                            className="flex items-centergap-3 text-sm text-white font-medium bg-black py-2 mr-2 rounded text-nowrap cursor-pointer"
                            disabled={isLoading || isUpdateLoader}
                            onClick={uploadMoreQuestions}
                          >
                            {isUpdateLoader ? (
                              <SpinnerLoader />
                            ) : (
                              <LuListCollapse className="text-lg" />
                            )}{" "}
                            Load More
                          </button>
                        </div>
                      )}
                    </>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <Drawer
            isOpen={openLeanMoreDrawer}
            onClose={() => setOpenLearnMoreDrawer(false)}
            title={!isLoading && explanation?.title}
            >
              {errorMsg && (
                <p className="flex gap-2 text-sm text-amber-600 font-medium">
                  <LuCircleAlert className="mt-1" /> {errorMsg}
                </p>
              )}
              {isLoading && <SkeletonLoader />}
              {isLoading && explanation && (
                <AIResponsePreview content={explanation?.explanation} />
              )}
          </Drawer>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InterviewPrep