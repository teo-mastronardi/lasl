import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import HomePage from '@/pages/Home';
import SchedulePage from '@/pages/Schedule';
import ResultsPage from '@/pages/Results';
import StandingsPage from '@/pages/Standings';
import StatsPage from '@/pages/Stats';
import TeamsPage from '@/pages/Teams';
import TeamPage from '@/pages/Team';
import RegistrationPage from '@/pages/Registration';
import RulesPage from '@/pages/Rules';
// import SponsorsPage from '@/pages/Sponsors';
import ContactPage from '@/pages/Contact';
import NotFoundPage from '@/pages/NotFound';

/** All application routes. Every page is wrapped by the shared Layout. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="standings" element={<StandingsPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="team/:slug" element={<TeamPage />} />
        <Route path="registration" element={<RegistrationPage />} />
        <Route path="rules" element={<RulesPage />} />
        {/* <Route path="sponsors" element={<SponsorsPage />} /> */}
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
