import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import GetStarted from "../pages/GetStarted";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Home from "../pages/Home";
import Level from "../pages/user/Level";
import Settings from "../pages/utils/Settings";
import Basic from "../pages/basic/Basic";
import SelectOption from "../pages/vocab/SelectOption";
import Grammar from "../pages/grammar/Grammar";
import N5Grammar from "../pages/grammar/N5Grammar";
import N4Grammar from "../pages/grammar/N4Grammar";
import N3Grammar from "../pages/grammar/N3Grammar";
import N2Grammar from "../pages/grammar/N2Grammar";
import N1Grammar from "../pages/grammar/N1Grammar";
import ChapterDetails from "../pages/grammar/ChapterDetails";
import Search from "../pages/reading/Search";
import Card from "../pages/reading/Card";
import CardDetails from "../pages/reading/CardDetails";
import Profile from "../pages/user/Profile";
import EditProfile from "../pages/user/EditProfile";
import NotFound from "../pages/utils/NotFound";
import BasicDetails from "../pages/basic/BasicDetails";
import BasicExam from "../pages/basic/BasicExam";
import Finish from "../pages/basic/Finish";
import Options from "../pages/Options";
import Kanji from "../pages/vocab/Kanji";
import Vocab from "../pages/vocab/Vocab";
import VerifyEmail from "../pages/user/VerifyEmail";
import ChapterExam from "../pages/exams/ChapterExam";
import ExamContainer from "../pages/exams/ExamContainer";
import SpeakingDetails from "../pages/grammar/SpeakingDetails";

import AdminLayout from "../pages/admin/AdminLayout";
import AdminCards from "../pages/admin/Card";
import AdminExams from "../pages/admin/Exam";
import AdminQuestions from "../pages/admin/Question";
import AdminLevel from "../pages/admin/Level";
import AdminKanji from "../pages/admin/Kanji";
import AdminGrammar from "../pages/admin/Grammar";
import AdminVocab from "../pages/admin/Vocabulary";
import AdminModule from "../pages/admin/Module";
import AdminLesson from "../pages/admin/Lesson";
import AdminSpeaking from "../pages/admin/Speaking";
import Auth from "../pages/auth/Auth";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ===== Public ===== */}
      <Route path="/" element={<GetStarted />} />
      <Route path="/authenticate" element={<Auth />} />
      <Route
        path="/options"
        element={
          <ProtectedRoute>
            <Options />
          </ProtectedRoute>
        }
      />

      {/* ===== Home (Protected) ===== */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      >
        <Route path="level" element={<Level />} />
        <Route path="settings" element={<Settings />} />

        {/* Basic */}
        <Route path="basic" element={<Basic />}>
          <Route path="lectures/:lectureId" element={<BasicDetails />} />
          <Route path="exam" element={<BasicExam />} />
          <Route path="finish" element={<Finish />} />
        </Route>

        {/* Vocab */}
        <Route path="moji-goi">
          <Route path="options" element={<SelectOption />} />
          <Route path="moji" element={<Kanji />} />
          <Route path="goi" element={<Vocab />} />
        </Route>

        {/* Grammar */}
        <Route path="grammar" element={<Grammar />}>
          <Route path="n5" element={<N5Grammar />} />
          <Route path="n4" element={<N4Grammar />} />
          <Route path="n3" element={<N3Grammar />} />
          <Route path="n2" element={<N2Grammar />} />
          <Route path="n1" element={<N1Grammar />} />
          <Route
            path="lectures/:lectureId/pattern/:patternId"
            element={<ChapterDetails />}
          />
          <Route
            path="lectures/:lectureId/speaking/:speakingId"
            element={<SpeakingDetails />}
          />
        </Route>

        {/* Exam Routes */}
        <Route path="exams" element={<ExamContainer />}>
          <Route path="lecture/:lectureId" element={<ChapterExam />} />
        </Route>

        {/* Reading */}
        <Route path="reading">
          <Route path="search" element={<Search />} />
          <Route path="cards" element={<Card />} />
          <Route path="cards/:id" element={<CardDetails />} />
        </Route>

        {/* User */}
        <Route path=":id">
          <Route path="profile" element={<Profile />} />
          <Route path="verify" element={<VerifyEmail />} />
          <Route path="profile/edit" element={<EditProfile />} />
        </Route>
      </Route>

      {/* ===== Admin (Separate) ===== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            {/* Optional AdminLayout */}
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="cards" element={<AdminCards />} />
        <Route path="exams" element={<AdminExams />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="modules" element={<AdminModule />} />
        <Route path="lessons" element={<AdminLesson />} />
        <Route path="levels" element={<AdminLevel />} />
        <Route path="kanji" element={<AdminKanji />} />
        <Route path="grammars" element={<AdminGrammar />} />
        <Route path="users" element={<AdminKanji />} />
        <Route path="vocabularies" element={<AdminVocab />} />
        <Route path="speakings" element={<AdminSpeaking />} />
      </Route>

      {/* ===== Error ===== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
