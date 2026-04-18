import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Overview from "../components/Overview";
import Hardware from "../components/Hardware";
import SoftwareStack from "../components/SoftwareStack";
import PIDTuning from "../components/PIDTuning";
import DigitalTwin from "../components/DigitalTwin";
import Results from "../components/Results";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div style={{ background: "#080808", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Overview />
      <Hardware />
      <SoftwareStack />
      <PIDTuning />
      <DigitalTwin />
      <Results />
      <Gallery />
      <Footer />
    </div>
  );
}
