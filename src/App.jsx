import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Gift,
  Home,
  LockKeyhole,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

import "./index.css";

const CAPTCHA_POOL = [
  {
    code: "A7K2P9",
    options: ["A7K2P9", "AJK29P", "A7L9P2", "X4M8Q1"],
  },
  {
    code: "K7M4P2",
    options: ["K7M4P2", "K7M42P", "K7M4P3", "X2B6Q8"],
  },
  {
    code: "A9M4L7",
    options: ["A9M4L7", "A9M4L1", "A9L7M4", "X2B6Q8"],
  },
  {
    code: "H2N8B9",
    options: ["H2N8B9", "H2NB89", "H2N9B8", "X7P4Q1"],
  },
  {
    code: "P6R3T8",
    options: ["P6R3T8", "P6RT38", "P6R8T3", "X4M7Q2"],
  },
];

function getNewCaptcha(previousCode = "") {
  const available = CAPTCHA_POOL.filter(
    (captcha) => captcha.code !== previousCode
  );

  return available[
    Math.floor(Math.random() * available.length)
  ];
}

function App() {
  const [captcha, setCaptcha] = useState(() =>
    getNewCaptcha()
  );

  const [screen, setScreen] = useState("challenge");

  const [selected, setSelected] = useState(null);

  const [balance, setBalance] = useState(125.5);

  const [reward, setReward] = useState(0);

  /* =========================================
     OPTION SELECTED
  ========================================= */

  const startVerification = (option) => {
    if (screen !== "challenge") return;

    setSelected(option);
    setScreen("selected");
  };

  /* =========================================
     SELECTED → VERIFYING
  ========================================= */

  useEffect(() => {
    if (screen !== "selected") return;

    const timer = setTimeout(() => {
      setScreen("verifying");
    }, 500);

    return () => clearTimeout(timer);
  }, [screen]);

  /* =========================================
     VERIFYING → CHECKING
  ========================================= */

  useEffect(() => {
    if (screen !== "verifying") return;

    const timer = setTimeout(() => {
      setScreen("checking");
    }, 1500);

    return () => clearTimeout(timer);
  }, [screen]);

  /* =========================================
     CHECKING → SUCCESS / WRONG
  ========================================= */

  useEffect(() => {
    if (screen !== "checking") return;

    const timer = setTimeout(() => {
      const isCorrect = selected === captcha.code;

      setReward(isCorrect ? 1 : 0.5);

      setScreen(
        isCorrect
          ? "correct"
          : "wrong"
      );
    }, 1800);

    return () => clearTimeout(timer);
  }, [screen, selected, captcha.code]);

  /* =========================================
     NEW CAPTCHA
  ========================================= */

  const createNewCaptcha = () => {
    const newCaptcha =
      getNewCaptcha(captcha.code);

    setCaptcha(newCaptcha);
    setSelected(null);
    setReward(0);
    setScreen("challenge");
  };

  /* =========================================
     NO THANKS
  ========================================= */

  const handleNoThanks = () => {
    createNewCaptcha();
  };

  /* =========================================
     CLAIM REWARD
  ========================================= */

  const handleClaim = () => {
    setScreen("mock-ad");
  };

  /* =========================================
     MOCK AD COMPLETE
  ========================================= */

  const handleMockComplete = () => {
    createNewCaptcha();
  };

  return (
    <main className="app-shell">

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />
<section className="mobile-app">

        <Header balance={balance} />

        {/* ================================
            1. CHALLENGE
        ================================= */}

        {screen === "challenge" && (
          <ChallengeScreen
            captcha={captcha}
            onSelect={startVerification}
            onRefresh={createNewCaptcha}
          />
        )}

        {/* ================================
            2. OPTION SELECTED
        ================================= */}

        {screen === "selected" && (
          <SelectedScreen
            captcha={captcha}
            selected={selected}
          />
        )}

        {/* ================================
            3. VERIFYING
        ================================= */}

        {screen === "verifying" && (
          <VerificationScreen />
        )}

        {/* ================================
            4. CHECKING
        ================================= */}

        {screen === "checking" && (
          <CheckingScreen />
        )}

        {/* ================================
            5. SUCCESS
        ================================= */}

        {screen === "correct" && (
          <ResultScreen
            type="correct"
            reward={1}
            balance={balance}
            onClaim={handleClaim}
            onNoThanks={handleNoThanks}
          />
        )}

        {/* ================================
            5. WRONG
        ================================= */}

        {screen === "wrong" && (
          <ResultScreen
            type="wrong"
            reward={0.5}
            balance={balance}
            onClaim={handleClaim}
            onNoThanks={handleNoThanks}
          />
        )}

        {/* ================================
            5A. MOCK REWARD
        ================================= */}

        {screen === "mock-ad" && (
          <MockAdScreen
            reward={reward}
            onComplete={handleMockComplete}
          />
        )}

        <BottomNavigation />

      </section>
    </main>
  );
}

/* =========================================
   HEADER
========================================= */

function Header({ balance }) {
  return (
    <header className="app-header">

      <button className="header-back">
        <ArrowLeft size={19} />
      </button>

      <div className="brand">
        <strong>VELOOP</strong>
        <span>REWARDS</span>
      </div>

      <div className="balance-pill">
        <DiamondIcon variant="cyan" className="ui-diamond ui-diamond-header" />
        <span>
          {balance.toFixed(2)}
        </span>
      </div>

    </header>
  );
}

/* =========================================
   CHALLENGE
========================================= */

function ChallengeScreen({
  captcha,
  onSelect,
  onRefresh,
}) {
  return (
    <div className="screen challenge-screen">

      <div className="secure-badge">
        <ShieldCheck size={14} />
        Secure Verification
      </div>

      <h1 className="page-title">
        Earn <span>Gems</span>
      </h1>

      <p className="page-subtitle">
        Complete a quick security check
        <br />
        to earn rewards.
      </p>

      <CaptchaCard
        captcha={captcha}
        selected={null}
        onSelect={onSelect}
        onRefresh={onRefresh}
      />

      <RewardCard amount="+1 Gem" />

    </div>
  );
}

/* =========================================
   CAPTCHA CARD
========================================= */

function CaptchaCard({
  captcha,
  selected,
  onSelect,
  onRefresh,
  disabled = false,
}) {
  return (
    <section className="captcha-card">

      <div className="captcha-title">

        <h2>
          CAPTCHA Verification
        </h2>

        <p>
          Please select the correct code shown below
        </p>

      </div>

      <div className="captcha-box">

        <div className="captcha-noise" />

        <strong className="captcha-code-text">
          {captcha.code.split("").map((char, index) => (
            <span
              key={`${char}-${index}`}
              style={{
                "--char-rotate": `${[-7, 3, -4, 6, -3, 5, -6][index % 7]}deg`,
                "--char-y": `${[-1, 2, -2, 1, -1, 2, -2][index % 7]}px`,
              }}
            >
              {char}
            </span>
          ))}
        </strong>

        <button
          className="refresh-code"
          onClick={onRefresh}
          disabled={disabled}
        >
          <RefreshCw size={13} />
          Refresh CAPTCHA
        </button>

      </div>

      <p className="matching-title">
        Select the matching code
      </p>

      <div className="captcha-options">

        {captcha.options.map((option) => (
          <button
            key={option}
            disabled={disabled}
            onClick={() =>
              onSelect(option)
            }
            className={`captcha-option ${
              selected === option
                ? "selected"
                : ""
            }`}
          >

            <span>
              {option}
            </span>

            {selected === option && (
              <span className="option-check">
                <Check size={13} />
              </span>
            )}

          </button>
        ))}

      </div>

      <SecurityNotice />

    </section>
  );
}

/* =========================================
   OPTION SELECTED
========================================= */

function SelectedScreen({
  captcha,
  selected,
}) {
  return (
    <div className="screen">

      <div className="secure-badge">
        <ShieldCheck size={14} />
        Secure Verification
      </div>

      <h1 className="page-title">
        Earn <span>Gems</span>
      </h1>

      <p className="page-subtitle">
        Complete a quick security check
        <br />
        to earn rewards.
      </p>

      <CaptchaCard
        captcha={captcha}
        selected={selected}
        onSelect={() => {}}
        onRefresh={() => {}}
        disabled
      />

      <div className="verification-mini">

        <Shield size={17} />

        <span>
          Verifying your answer...
        </span>

      </div>

      <div className="mini-progress">
        <div />
      </div>

      <RewardCard amount="+1 Gem" />

    </div>
  );
}

/* =========================================
   VERIFYING
========================================= */

function VerificationScreen() {
  return (
    <div className="state-screen">

      <div className="verification-orbit">

        <div className="orbit orbit-one" />

        <div className="orbit orbit-two" />

        <div className="orbit orbit-three" />

        <div className="verification-icon">

          <ShieldCheck size={68} />

        </div>

      </div>

      <h1>
        Verifying...
      </h1>

      <p>
        Please wait while we
        <br />
        verify your answer.
      </p>

      <div className="large-progress">
        <div />
      </div>

      <SecurityNotice
        text="Do not close this screen while verification is in progress."
      />

    </div>
  );
}

/* =========================================
   CHECKING
========================================= */

function CheckingScreen() {
  return (
    <div className="checking-screen">

      <div className="checking-visual">

        <div className="checking-ring" />

        <div className="checking-ring" />

        <div className="checking-ring" />

        <div className="checking-glass" />

      </div>

      <h1>
        Checking your answer
      </h1>

      <p>
        Please wait a moment
      </p>

      <div className="checking-dots">

        <span />
        <span />
        <span />

      </div>

      <div className="checking-message">
        This will only take a second
      </div>

    </div>
  );
}

/* =========================================
   RESULT
========================================= */

function ResultScreen({
  type,
  reward,
  balance,
  onClaim,
  onNoThanks,
}) {
  const isCorrect =
    type === "correct";

  const newBalance =
    (balance + reward).toFixed(2);

  return (
    <div
      className={`result-screen ${
        isCorrect
          ? "result-success"
          : "result-error"
      }`}
    >

      <div className="result-particles">

        <span />
        <span />
        <span />
        <span />
        <span />

      </div>

      <div className="result-icon">

        {isCorrect ? (
          <Check size={62} />
        ) : (
          <X size={62} />
        )}

      </div>

      <h1>
        {isCorrect
          ? "Verification Complete!"
          : "Verification Unsuccessful"}
      </h1>

      <p className="result-description">

        {isCorrect
          ? "CAPTCHA verified successfully"
          : "The selected code doesn't match the image shown."}

      </p>

      {!isCorrect && (
        <p className="wrong-helper">
          You can continue with a new challenge.
        </p>
      )}

      <div className="earned-reward">

        <DiamondIcon variant="gold" className="ui-diamond ui-diamond-earned" />

        <strong>
          +{reward}{" "}
          {reward === 1
            ? "Gem"
            : "Gems"}
        </strong>

      </div>

      <div className="balance-change">

        <div>
          <strong>
            {balance.toFixed(2)}
          </strong>

          <span>
            Previous Balance
          </span>
        </div>

        <span className="balance-arrow">
          →
        </span>

        <div>
          <strong>
            {newBalance}
          </strong>

          <span>
            New Balance
          </span>
        </div>

      </div>

      <button
        className={`claim-button ${
          isCorrect
            ? "claim-success"
            : "claim-error"
        }`}
        onClick={onClaim}
      >

        <Gift size={18} />

        Claim Reward

      </button>

      <button
        className="no-thanks-button"
        onClick={onNoThanks}
      >
        No Thanks
      </button>

      <SecurityNotice
        text={
          isCorrect
            ? "Your reward is ready to be claimed."
            : "Security checks keep your account safe."
        }
      />

    </div>
  );
}

/* =========================================
   MOCK AD
========================================= */

function MockAdScreen({ reward, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="mock-ad-screen">

      <h1>Preparing your reward</h1>

      <p>
        Please watch a short ad to
        <br />
        claim your reward.
      </p>

      <div className="ad-visual">

        {/* glowing rings */}
        <div className="ad-orbit orbit-a" />
        <div className="ad-orbit orbit-b" />
        <div className="ad-orbit orbit-c" />

        {/* real faceted diamonds */}
        <DiamondIcon className="diamond-left" />
        <DiamondIcon className="diamond-top" />
        <DiamondIcon className="diamond-right" />

        {/* clapperboard */}
        <div className="clapper">

          <div className="clapper-slate">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="clapper-screen">

            <div className="play-button">
              <div className="play-triangle" />
            </div>

          </div>

        </div>

      </div>

      <div className="reward-progress">
        <div className="reward-progress-fill" />
      </div>

      <div className="mock-status">
        Almost done...
      </div>

    </div>
  );
}
function DiamondIcon({
  variant = "purple",
  className = "",
}) {
  const uid = Math.random().toString(36).slice(2, 9);

  const palettes = {
    cyan: {
      top1: "#FFFFFF",
      top2: "#67E8F9",
      mid: "#22D3EE",
      deep: "#0369A1",
      side: "#0891B2",
      edge: "#A5F3FC",
      glow: "#00E5FF",
    },
    gold: {
      top1: "#FFFDE7",
      top2: "#FFE082",
      mid: "#FFD54F",
      deep: "#B7791F",
      side: "#D69E2E",
      edge: "#FFF3B0",
      glow: "#FFD75A",
    },
    purple: {
      top1: "#FFFFFF",
      top2: "#E9D5FF",
      mid: "#C084FC",
      deep: "#6D28D9",
      side: "#9333EA",
      edge: "#F3E8FF",
      glow: "#B56CFF",
    },
  };

  const c = palettes[variant] || palettes.purple;

  return (
    <svg
      className={`real-diamond ${className}`}
      viewBox="0 0 120 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`top-${uid}`} x1="16" y1="12" x2="103" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c.top1} />
          <stop offset="30%" stopColor={c.top2} />
          <stop offset="68%" stopColor={c.mid} />
          <stop offset="100%" stopColor={c.side} />
        </linearGradient>

        <linearGradient id={`body-${uid}`} x1="25" y1="36" x2="83" y2="103" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c.mid} />
          <stop offset="48%" stopColor={c.side} />
          <stop offset="100%" stopColor={c.deep} />
        </linearGradient>

        <linearGradient id={`center-${uid}`} x1="59" y1="25" x2="59" y2="102" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c.top1} stopOpacity="0.95" />
          <stop offset="42%" stopColor={c.mid} stopOpacity="0.78" />
          <stop offset="100%" stopColor={c.deep} stopOpacity="0.92" />
        </linearGradient>

        <filter id={`glow-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feColorMatrix in="blur" type="matrix"
            values={`0 0 0 0 ${parseInt(c.glow.slice(1,3),16)/255}
                     0 0 0 0 ${parseInt(c.glow.slice(3,5),16)/255}
                     0 0 0 0 ${parseInt(c.glow.slice(5,7),16)/255}
                     0 0 0 .72 0`} />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* soft crystal glow */}
      <path
        d="M12 34L27 12H92L108 34L60 103L12 34Z"
        fill="none"
        stroke={c.glow}
        strokeWidth="3"
        opacity="0.7"
        filter={`url(#glow-${uid})`}
      />

      {/* main lower crystal */}
      <path
        d="M12 34L27 12H92L108 34L60 103L12 34Z"
        fill={`url(#body-${uid})`}
        stroke={c.edge}
        strokeWidth="1.8"
      />

      {/* crown / top table */}
      <path
        d="M12 34L27 12H92L108 34H12Z"
        fill={`url(#top-${uid})`}
        stroke={c.edge}
        strokeWidth="1.8"
      />

      {/* crown facets */}
      <path d="M27 12L43 34L60 12L77 34L92 12" stroke="#FFFFFF" strokeWidth="1.6" opacity="0.9" />
      <path d="M12 34H108" stroke={c.edge} strokeWidth="1.5" opacity="0.95" />

      {/* lower facets */}
      <path d="M12 34L43 34L60 103L27 34Z" fill={c.mid} opacity="0.5" />
      <path d="M108 34L77 34L60 103L92 34Z" fill={c.deep} opacity="0.5" />
      <path d="M43 34L60 12L77 34L60 103L43 34Z" fill={`url(#center-${uid})`} opacity="0.62" />

      {/* facet edges */}
      <path d="M43 34L60 103L77 34" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.7" />
      <path d="M27 12L12 34M92 12L108 34" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />

      {/* sharp specular highlights */}
      <path d="M29 19L39 15" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M82 17L89 20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

/* =========================================
   REWARD CARD
========================================= */

function RewardCard({
  amount,
}) {
  return (
    <div className="reward-card">

      <div className="reward-gem">

        <DiamondIcon variant="gold" className="ui-diamond ui-diamond-reward" />

      </div>

      <div>

        <span>
          Complete verification to earn
        </span>

        <strong>
          {amount}
        </strong>

      </div>

    </div>
  );
}

/* =========================================
   SECURITY NOTICE
========================================= */

function SecurityNotice({
  text =
    "This helps protect your account from automated access.",
}) {
  return (
    <div className="security-notice">

      <Shield size={20} />

      <span>
        {text}
      </span>

    </div>
  );
}

/* =========================================
   BOTTOM NAVIGATION
========================================= */

function BottomNavigation() {
  return (
    <nav className="bottom-nav">

      <button>
        <Home size={19} />
        <span>Dashboard</span>
      </button>

      <button className="nav-active nav-earn">
        <DiamondIcon variant="cyan" className="ui-diamond ui-diamond-nav" />
        <span className="nav-earn-label">Earn</span>
      </button>

      <button className="v-logo">
        V
      </button>

      <button>
        <Wallet size={19} />
        <span>Wallet</span>
      </button>

      <button>
        <UserRound size={19} />
        <span>Profile</span>
      </button>

    </nav>
  );
}

export default App;