import React, {
  useMemo,
  useState,
  useEffect
} from 'react';

import {
  createRoot
} from 'react-dom/client';

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Dumbbell,
  Flame,
  HeartPulse,
  Leaf,
  Menu,
  Moon,
  Plus,
  Salad,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Utensils,
  Zap
} from 'lucide-react';

import {
  FOOD_DB,
  optimizeMeals,
  scheduleWorkouts
} from './algorithms';

import './styles.css';


const fmt = n =>
  Math.round(n * 10) / 10;


function App() {

  const [page, setPage] =
    useState('Overview');

  // Personal profile drives the calculator, accessible movement guidance and food preferences.
  const [profile, setProfile] = useState(() => {
    const defaults = { age: 25, sex: 'female', height: 165, weight: 70, activity: 'moderate', goal: 'maintain', diet: 'vegetarian', conditions: 'none', injury: 'none', foods: 'rice, dal, oats, banana, tofu, paneer, broccoli' };
    try { return { ...defaults, ...JSON.parse(localStorage.getItem('fitora-profile') || '{}') }; } catch { return defaults; }
  });
  const updateProfile = (key, value) =>
    setProfile(previous => ({ ...previous, [key]: value }));
  const [progressLog, setProgressLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fitora-progress-log') || '[]'); } catch { return []; }
  });
  const [dailyHabits, setDailyHabits] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fitora-daily-habits') || '{"water":0,"sleep":8,"workouts":0,"calories":0,"protein":0,"fiber":0,"carbs":0,"fat":0}'); } catch { return {water:0,sleep:8,workouts:0,calories:0,protein:0,fiber:0,carbs:0,fat:0}; }
  });
  const [logWeight, setLogWeight] = useState('');
  const [assistantQuestion, setAssistantQuestion] = useState('');
  const [assistantAnswer, setAssistantAnswer] = useState('Choose a topic or ask a general question about your plan. This guide uses built-in guidance and is not a medical professional.');
  const [exerciseFilter, setExerciseFilter] = useState('All');
  useEffect(() => { localStorage.setItem('fitora-progress-log', JSON.stringify(progressLog)); }, [progressLog]);
  useEffect(() => { localStorage.setItem('fitora-daily-habits', JSON.stringify(dailyHabits)); }, [dailyHabits]);
  useEffect(() => { localStorage.setItem('fitora-profile', JSON.stringify(profile)); }, [profile]);
  const bmi = Number(profile.weight) / Math.pow(Number(profile.height) / 100, 2);
  const bmr = 10 * Number(profile.weight) + 6.25 * Number(profile.height) -
    5 * Number(profile.age) + (profile.sex === 'male' ? 5 : -161);
  const activityFactor = ({ sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 })[profile.activity] || 1.55;
  const maintenanceCalories = Math.round(bmr * activityFactor);
  const targetCalories = Math.round(maintenanceCalories + ({ lose: -300, maintain: 0, gain: 250 })[profile.goal]);


  const [calories, setCalories] =
    useState(2000);

  const [proteinGoal, setProteinGoal] =
    useState(120);

  const [fatFloor, setFatFloor] =
    useState(40);

  const [fiberFloor, setFiberFloor] =
    useState(20);

  const [days, setDays] =
    useState(5);

  const [search, setSearch] =
    useState('');

  const [notice, setNotice] =
    useState('');


  // ===================================================
  // CUSTOM FOOD STATE
  // ===================================================

  const [customFoods, setCustomFoods] =
    useState([]);


  const [foodForm, setFoodForm] =
    useState({

      name: '',
      category: 'Protein',
      serving: '',
      calories: '',
      protein: '',
      fat: '',
      fiber: '',
      carbs: '',
      max: 1,
      divisible: true

    });


  // ===================================================
  // CUSTOM EXERCISE STATE
  // ===================================================

  const [exerciseDay, setExerciseDay] =
    useState(0);

  const [exerciseName, setExerciseName] =
    useState('');


  const [customExercises, setCustomExercises] =
    useState({

      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []

    });


  const [result, setResult] =
    useState(
      () =>
        optimizeMeals({
          calories: 2000,
          proteinGoal: 120,
          fatFloor: 40,
          fiberFloor: 20
        })
    );


  const [schedule, setSchedule] =
    useState(
      () =>
        scheduleWorkouts(5)
    );


  const [mobileOpen, setMobileOpen] =
    useState(false);


  const nav = [
    {
      name: 'Overview',
      icon: BarChart3
    },
    {
      name: 'Meal optimizer',
      icon: Salad
    },
    {
      name: 'Workout planner',
      icon: Dumbbell
    },
    {
      name: 'Personal plan',
      icon: HeartPulse
    },
    {
      name: 'Progress & habits',
      icon: Target
    }
  ];


  // ===================================================
  // ALL FOODS
  // ===================================================

  const allFoods = useMemo(
    () => [
      ...FOOD_DB,
      {id:'idli',name:'Idli',category:'Indian meals',serving:'2 medium idlis',calories:130,protein:4,fat:1,fiber:2,carbs:27,divisible:true,max:2},
      {id:'dosa',name:'Plain dosa',category:'Indian meals',serving:'1 medium dosa',calories:168,protein:4,fat:5,fiber:2,carbs:27,divisible:true,max:2},
      {id:'roti',name:'Whole-wheat roti',category:'Indian meals',serving:'1 medium roti',calories:110,protein:3.5,fat:1.5,fiber:3,carbs:20,divisible:true,max:4},
      {id:'chana',name:'Cooked chana masala',category:'Indian meals',serving:'150 g bowl',calories:240,protein:11,fat:7,fiber:9,carbs:34,divisible:true,max:2},
      {id:'sambar',name:'Sambar',category:'Indian meals',serving:'150 ml bowl',calories:90,protein:4,fat:3,fiber:4,carbs:12,divisible:true,max:3},
      {id:'poha',name:'Vegetable poha',category:'Indian meals',serving:'1 bowl',calories:220,protein:5,fat:7,fiber:4,carbs:34,divisible:true,max:2},
      {id:'sprouts',name:'Moong sprouts',category:'Indian meals',serving:'100 g',calories:30,protein:3,fat:0.2,fiber:2,carbs:6,divisible:true,max:3},
      {id:'soy-chunks',name:'Cooked soya chunks',category:'Plant protein',serving:'50 g dry equivalent',calories:172,protein:26,fat:0.5,fiber:7,carbs:16,divisible:true,max:2},
      ...customFoods
    ],
    [customFoods]
  );


  const personalizedFoods = allFoods.filter(food => {
    const name = food.name.toLowerCase();
    if (profile.diet === 'vegan' && /egg|chicken|fish|salmon|tuna|paneer|yogurt|milk|greek yogurt|cheese|curd|butter|whey|meat/.test(name)) return false;
    if (profile.diet === 'vegetarian' && /chicken|fish|salmon|tuna|meat/.test(name)) return false;
    const likes = profile.foods.split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
    return !likes.length || likes.some(x => name.includes(x) || x.includes(name));
  });
  const safeExercises = (() => {
    if (profile.conditions === 'mobility') return ['Seated upper-body mobility (comfortable range)', 'Gentle seated marching if comfortable', 'Seated resistance-band pulls', 'Supported breathing and posture practice'];
    if (profile.conditions === 'wheelchair') return ['Seated shoulder rolls', 'Seated resistance-band rows', 'Comfortable arm raises', 'Wrist and hand mobility'];
    if (profile.injury !== 'none') return ['Pain-free movement outside the injured area only', 'Gentle breathing and relaxation', 'Clinician-approved mobility exercises', 'Avoid loading or stretching the injured area until assessed'];
    return ['Brisk walking or comfortable cycling', 'Bodyweight squats (if pain-free)', 'Wall or incline push-ups', 'Gentle core stability'];
  })();

  const visibleFoods =
    useMemo(
      () =>
        allFoods.filter(
          food =>
            `${food.name} ${food.category}`
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
        ),
      [allFoods, search]
    );


  // ===================================================
  // MEAL OPTIMIZER
  // ===================================================

  const runOptimizer = () => {

    const next =
      optimizeMeals({

        calories:
          Number(calories),

        proteinGoal:
          Number(proteinGoal),

        fatFloor:
          Number(fatFloor),

        fiberFloor:
          Number(fiberFloor),

        foods:
          personalizedFoods

      });


    setResult(next);


    setNotice(
      next.feasible
        ? 'Optimization complete — a feasible meal combination was found.'
        : 'A best-effort plan was generated. Try a higher calorie budget or lower nutrient floors.'
    );


    setTimeout(
      () => setNotice(''),
      5000
    );
  };


  // ===================================================
  // ADD CUSTOM FOOD
  // ===================================================

  const addCustomFood = () => {

    if (
      !foodForm.name.trim() ||
      !foodForm.serving.trim() ||
      !foodForm.calories ||
      !foodForm.protein
    ) {

      setNotice(
        'Please enter the food name, serving, calories and protein.'
      );

      setTimeout(
        () => setNotice(''),
        3500
      );

      return;
    }


    const newFood = {

      id:
        `custom-${Date.now()}`,

      name:
        foodForm.name.trim(),

      category:
        foodForm.category,

      serving:
        foodForm.serving.trim(),

      calories:
        Number(foodForm.calories),

      protein:
        Number(foodForm.protein),

      fat:
        Number(foodForm.fat) || 0,

      fiber:
        Number(foodForm.fiber) || 0,

      carbs:
        Number(foodForm.carbs) || 0,

      divisible:
        Boolean(foodForm.divisible),

      max:
        foodForm.divisible
          ? Math.max(
              1,
              Number(foodForm.max) || 1
            )
          : 1,

      custom: true
    };


    setCustomFoods(
      previous => [
        ...previous,
        newFood
      ]
    );


    setFoodForm({

      name: '',
      category: 'Protein',
      serving: '',
      calories: '',
      protein: '',
      fat: '',
      fiber: '',
      carbs: '',
      max: 1,
      divisible: true

    });


    setNotice(
      `${newFood.name} was added to your food database.`
    );


    setTimeout(
      () => setNotice(''),
      3500
    );
  };


  // ===================================================
  // REMOVE CUSTOM FOOD
  // ===================================================

  const removeCustomFood = id => {

    setCustomFoods(
      previous =>
        previous.filter(
          food =>
            food.id !== id
        )
    );


    setNotice(
      'Custom food removed.'
    );


    setTimeout(
      () => setNotice(''),
      2500
    );
  };


  // ===================================================
  // WORKOUT GENERATOR
  // ===================================================

  const runSchedule = () => {

    setSchedule(
      scheduleWorkouts(
        Number(days)
      )
    );


    setNotice(
      'Workout schedule refreshed using Welsh–Powell graph coloring.'
    );


    setTimeout(
      () => setNotice(''),
      4000
    );
  };


  // ===================================================
  // ADD CUSTOM EXERCISE
  // ===================================================

  const addExercise = () => {

    const name =
      exerciseName.trim();


    if (!name) {

      setNotice(
        'Enter an exercise name first.'
      );

      setTimeout(
        () => setNotice(''),
        2500
      );

      return;
    }


    const dayName =
      [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ][exerciseDay];


    setCustomExercises(
      previous => ({

        ...previous,

        [dayName]: [
          ...(previous[dayName] || []),
          name
        ]

      })
    );


    setExerciseName('');


    setNotice(
      `${name} added to ${dayName}.`
    );


    setTimeout(
      () => setNotice(''),
      3000
    );
  };


  // ===================================================
  // REMOVE CUSTOM EXERCISE
  // ===================================================

  const removeExercise = (
    dayName,
    exercise
  ) => {

    setCustomExercises(
      previous => ({

        ...previous,

        [dayName]:
          (
            previous[dayName] || []
          ).filter(
            item =>
              item !== exercise
          )

      })
    );
  };


  const totals =
    result.totals;

  const maxCalories =
    Number(calories) || 1;


  const Card = ({
    children,
    className = ''
  }) => (

    <section
      className={`panel ${className}`}
    >
      {children}
    </section>

  );


  const Stat = ({
    icon: Icon,
    label,
    value,
    unit,
    change,
    tone = 'violet'
  }) => (

    <div className="stat-card">

      <div
        className={`stat-icon ${tone}`}
      >
        <Icon size={18} />
      </div>

      <div className="stat-meta">

        <span>
          {label}
        </span>

        <strong>

          {value}

          <small>
            {unit}
          </small>

        </strong>

        <em>
          <ArrowUpRight size={13} />
          {change}
        </em>

      </div>

    </div>

  );


  return (

    <div className="app-shell">

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          mobileOpen
            ? 'open'
            : ''
        }`}
      >

        <div className="brand">

          <div className="brand-mark">
            <Activity size={22} />
          </div>

          <div>

            <b>
              fitora<span>.</span>
            </b>

            <small>
              SMART FITNESS OS
            </small>

          </div>

          <button
            className="mobile-close"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            ×
          </button>

        </div>


        <div className="workspace-label">
          WORKSPACE
        </div>


        <nav>

          {nav.map(
            ({
              name,
              icon: Icon
            }) => (

              <button
                key={name}
                className={`nav-item ${
                  page === name
                    ? 'active'
                    : ''
                }`}
                onClick={() => {

                  setPage(name);
                  setMobileOpen(false);

                }}
              >

                <Icon size={18} />

                <span>
                  {name}
                </span>

                {name ===
                  'Meal optimizer' && (
                  <span className="nav-dot" />
                )}

              </button>

            )
          )}

        </nav>


        <div className="side-divider" />

        <div className="workspace-label">
          YOUR PROGRESS
        </div>


        <div className="side-progress">

          <div className="progress-head">

            <span>
              Weekly consistency
            </span>

            <b>
              4/5
            </b>

          </div>


          <div className="progress-track">
            <i
              style={{
                width: '80%'
              }}
            />
          </div>


          <p>
            One more session to hit your goal.
          </p>

        </div>


        <div className="sidebar-bottom">

          <div className="pro-card">

            <div className="pro-icon">
              <Sparkles size={17} />
            </div>

            <b>
              Make every rep count.
            </b>

            <p>
              Small choices. Stronger habits.
            </p>

            <div className="pro-decoration">
              ✳
            </div>

          </div>


          <button className="profile-row">

            <div className="avatar">
              HD
            </div>

            <div className="profile-text">

              <b>
                Your workspace
              </b>

              <small>
                Personal plan
              </small>

            </div>

            <ChevronDown size={15} />

          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="main-content">

        <header className="topbar">

          <div className="top-left">

            <button
              className="hamburger"
              onClick={() =>
                setMobileOpen(
                  !mobileOpen
                )
              }
            >
              <Menu size={20} />
            </button>

            <span className="breadcrumb">

              Workspace

              <span>
                /
              </span>

              <b>
                {page}
              </b>

            </span>

          </div>


          <div className="top-actions">

            <div className="status-pill">

              <span />

              SYSTEM READY

            </div>


            <button
              className="icon-button"
              title="Settings"
            >
              <Settings2 size={18} />
            </button>


            <div className="avatar top-avatar">
              HD
            </div>

          </div>

        </header>


        <div className="page-wrap">


          {/* PAGE HEADER */}

          <div className="welcome-row">

            <div>

              <div className="eyebrow">

                <span className="eyebrow-line" />

                YOUR PERSONAL PERFORMANCE HUB

              </div>


              <h1>

                {page === 'Overview' ? (
                  <>
                    Train smarter.
                    <br />
                    <span>
                      Live stronger.
                    </span>
                  </>
                ) : page ===
                  'Meal optimizer' ? (
                  <>
                    Nutrition,{' '}
                    <span>
                      optimized.
                    </span>
                  </>
                ) : page === 'Workout planner' ? (
                  <>
                    Build your week.
                    <br />
                    <span>
                      Recover better.
                    </span>
                  </>
                ) : page === 'Progress & habits' ? (<>Small habits. <span>Real progress.</span></>) : (<>Your plan, <span>your way.</span></>)}

              </h1>


              <p className="subtitle">

                {page === 'Overview'
                  ? 'Your fitness goals, powered by thoughtful algorithms.'
                  : page === 'Meal optimizer'
                  ? 'Find a high-protein meal combination that respects your nutrition targets.'
                  : page === 'Workout planner' ? 'A recovery-aware split, arranged with graph-coloring logic.' : page === 'Progress & habits' ? 'Track trends, hydration, nutrition, sleep and workout consistency over time.' : 'Personalized calorie estimates, accessible movement options and food choices in one place.'}

              </p>

            </div>


            <div className="date-chip">

              <CalendarDays size={16} />

              <span>
                MONDAY, OCT 12
              </span>

            </div>

          </div>


          {/* NOTICE */}

          {notice && (

            <div className="notice">

              <Check size={16} />

              {notice}

              <button
                onClick={() =>
                  setNotice('')
                }
              >
                ×
              </button>

            </div>

          )}


          {/* ================================================= */}
          {/* OVERVIEW */}
          {/* ================================================= */}

          {page === 'Overview' && (

            <>

              <div className="stat-grid">

                <Stat
                  icon={Flame}
                  label="Daily calorie budget"
                  value={calories.toLocaleString()}
                  unit=" kcal"
                  change="Plan target"
                />

                <Stat
                  icon={Zap}
                  label="Protein selected"
                  value={fmt(
                    totals.protein
                  )}
                  unit=" g"
                  change={`${proteinGoal} g goal`}
                  tone="pink"
                />

                <Stat
                  icon={HeartPulse}
                  label="Fat minimum"
                  value={`${fmt(
                    totals.fat
                  )} / ${fatFloor}`}
                  unit=" g"
                  change={
                    totals.fat >=
                    fatFloor
                      ? 'Floor met'
                      : 'Below floor'
                  }
                  tone="orange"
                />

                <Stat
                  icon={Leaf}
                  label="Fiber minimum"
                  value={`${fmt(
                    totals.fiber
                  )} / ${fiberFloor}`}
                  unit=" g"
                  change={
                    totals.fiber >=
                    fiberFloor
                      ? 'Floor met'
                      : 'Below floor'
                  }
                  tone="green"
                />

              </div>


              <div className="dashboard-grid">

                <Card className="hero-panel">

                  <div className="panel-top">

                    <div>

                      <div className="section-kicker">
                        YOUR DAILY SNAPSHOT
                      </div>

                      <h2>
                        Fuel your potential
                      </h2>

                    </div>

                    <span className="live-tag">
                      <span />
                      LIVE PLAN
                    </span>

                  </div>


                  <div className="hero-body">

                    <div
                      className="calorie-ring"
                      style={{
                        '--progress':
                          `${Math.min(
                            100,
                            totals.calories /
                              maxCalories *
                              100
                          )}%`
                      }}
                    >

                      <div className="ring-inner">

                        <Flame size={19} />

                        <strong>
                          {Math.round(
                            totals.calories
                          )}
                        </strong>

                        <span>
                          kcal planned
                        </span>

                      </div>

                    </div>


                    <div className="macro-list">

                      <div className="macro-row">

                        <div className="macro-label">

                          <i className="dot purple" />

                          Protein

                          <b>
                            {fmt(
                              totals.protein
                            )}g
                          </b>

                        </div>

                        <div className="macro-track">

                          <i
                            className="purple-fill"
                            style={{
                              width:
                                `${Math.min(
                                  100,
                                  totals.protein /
                                    Math.max(
                                      proteinGoal,
                                      1
                                    ) *
                                    100
                                )}%`
                            }}
                          />

                        </div>

                      </div>


                      <div className="macro-row">

                        <div className="macro-label">

                          <i className="dot pink" />

                          Carbs

                          <b>
                            {fmt(
                              totals.carbs
                            )}g
                          </b>

                        </div>

                        <div className="macro-track">

                          <i
                            className="pink-fill"
                            style={{
                              width:
                                `${Math.min(
                                  100,
                                  totals.carbs /
                                    250 *
                                    100
                                )}%`
                            }}
                          />

                        </div>

                      </div>


                      <div className="macro-row">

                        <div className="macro-label">

                          <i className="dot orange" />

                          Fat

                          <b>
                            {fmt(
                              totals.fat
                            )}g
                          </b>

                        </div>

                        <div className="macro-track">

                          <i
                            className="orange-fill"
                            style={{
                              width:
                                `${Math.min(
                                  100,
                                  totals.fat /
                                    70 *
                                    100
                                )}%`
                            }}
                          />

                        </div>

                      </div>

                    </div>

                  </div>


                  <div className="panel-footer">

                    <span>

                      <ShieldCheck size={15} />

                      Nutrient floors{' '}

                      {result.feasible
                        ? 'satisfied'
                        : 'need attention'}

                    </span>


                    <button
                      className="text-link"
                      onClick={() =>
                        setPage(
                          'Meal optimizer'
                        )
                      }
                    >

                      Explore meal plan

                      <ArrowUpRight
                        size={15}
                      />

                    </button>

                  </div>

                </Card>


                <Card className="quick-panel">

                  <div className="panel-top">

                    <div>

                      <div className="section-kicker">
                        QUICK ACTIONS
                      </div>

                      <h2>
                        What’s the focus?
                      </h2>

                    </div>

                    <div className="round-icon">
                      <Sparkles size={17} />
                    </div>

                  </div>


                  <button
                    className="action-tile"
                    onClick={() =>
                      setPage(
                        'Meal optimizer'
                      )
                    }
                  >

                    <div className="action-icon violet-bg">
                      <Utensils size={18} />
                    </div>

                    <div>

                      <b>
                        Optimize meals
                      </b>

                      <small>
                        Balance protein, calories & fiber
                      </small>

                    </div>

                    <ArrowUpRight size={17} />

                  </button>


                  <button
                    className="action-tile"
                    onClick={() =>
                      setPage(
                        'Workout planner'
                      )
                    }
                  >

                    <div className="action-icon pink-bg">
                      <Dumbbell size={18} />
                    </div>

                    <div>

                      <b>
                        Plan your workouts
                      </b>

                      <small>
                        Schedule muscle groups intelligently
                      </small>

                    </div>

                    <ArrowUpRight size={17} />

                  </button>


                  <div className="tip-box">

                    <Sparkles size={16} />

                    <div>

                      <b>
                        Smart tip
                      </b>

                      <p>
                        Pair consistent protein intake with recovery days. Your plan is a starting point, not medical advice.
                      </p>

                    </div>

                  </div>

                </Card>

              </div>


              <div className="bottom-grid">

                <Card>

                  <div className="panel-top">

                    <div>

                      <div className="section-kicker">
                        MEAL COMPOSITION
                      </div>

                      <h2>
                        Today’s food lineup
                      </h2>

                    </div>

                    <button
                      className="subtle-button"
                      onClick={() =>
                        setPage(
                          'Meal optimizer'
                        )
                      }
                    >

                      View all

                      <ArrowUpRight size={14} />

                    </button>

                  </div>


                  <div className="food-list">

                    {result.selected
                      .slice(0, 5)
                      .map(
                        ({
                          food,
                          qty
                        }) => (

                          <div
                            className="food-row"
                            key={food.id}
                          >

                            <div className="food-emoji">

                              {food.category ===
                              'Protein'
                                ? '◈'
                                : food.category ===
                                  'Fruit'
                                ? '◉'
                                : food.category ===
                                  'Vegetables'
                                ? '❋'
                                : '◇'}

                            </div>


                            <div className="food-name">

                              <b>
                                {food.name}
                              </b>

                              <small>
                                {food.serving}
                                {!food.divisible
                                  ? ' · whole item'
                                  : ''}
                              </small>

                            </div>


                            <span className="food-qty">
                              × {qty}
                            </span>


                            <b className="food-cal">

                              {food.calories *
                                qty}

                              <small>
                                kcal
                              </small>

                            </b>

                          </div>

                        )
                      )}

                  </div>

                </Card>


                <Card className="week-panel">

                  <div className="panel-top">

                    <div>

                      <div className="section-kicker">
                        TRAINING RHYTHM
                      </div>

                      <h2>
                        Your weekly split
                      </h2>

                    </div>

                    <button
                      className="subtle-button"
                      onClick={() =>
                        setPage(
                          'Workout planner'
                        )
                      }
                    >

                      Edit

                      <ArrowUpRight size={14} />

                    </button>

                  </div>


                  <div className="mini-week">

                    {schedule
                      .slice(0, 7)
                      .map(
                        d => (

                          <button
                            key={d.name}
                            onClick={() =>
                              setPage(
                                'Workout planner'
                              )
                            }
                            className={`mini-day ${
                              d.groups.length
                                ? 'has-workout'
                                : ''
                            }`}
                          >

                            <span>
                              {d.name.slice(0, 1)}
                            </span>

                            <i>
                              {d.groups.length
                                ? d.groups.length
                                : '·'}
                            </i>

                          </button>

                        )
                      )}

                  </div>


                  <div className="week-summary">

                    <span>

                      <span className="tiny-dot" />

                      {days} training days / week

                    </span>

                    <span>
                      {
                        schedule.filter(
                          d =>
                            d.groups.length
                        ).length
                      } active days
                    </span>

                  </div>


                  <div className="recovery-note">

                    <Moon size={15} />

                    <span>
                      Rest is part of the program. Give connected muscle groups time to recover.
                    </span>

                  </div>

                </Card>

              </div>

            </>

          )}



          {/* ================================================= */}
          {/* PERSONAL FITNESS PROFILE */}
          {/* ================================================= */}
          {page === 'Personal plan' && (
            <div className="personal-layout">
              <Card>
                <div className="panel-top">
                  <div><div className="section-kicker">PERSONAL CALCULATOR</div><h2>Build your starting plan</h2>
                    <p className="panel-desc">Estimates are a starting point, not a diagnosis or medical prescription.</p></div>
                  <div className="round-icon"><HeartPulse size={18}/></div>
                </div>
                <div className="personal-form-grid">
                  <label>Age<input type="number" min="18" max="100" value={profile.age} onChange={e=>updateProfile('age',e.target.value)}/></label>
                  <label>Sex used for estimate<select value={profile.sex} onChange={e=>updateProfile('sex',e.target.value)}><option value="female">Female</option><option value="male">Male</option></select></label>
                  <label>Height (cm)<input type="number" min="100" max="250" value={profile.height} onChange={e=>updateProfile('height',e.target.value)}/></label>
                  <label>Weight (kg)<input type="number" min="25" max="350" value={profile.weight} onChange={e=>updateProfile('weight',e.target.value)}/></label>
                  <label>Usual activity<select value={profile.activity} onChange={e=>updateProfile('activity',e.target.value)}><option value="sedentary">Mostly sitting</option><option value="light">Light activity</option><option value="moderate">Moderately active</option><option value="active">Very active</option></select></label>
                  <label>Goal<select value={profile.goal} onChange={e=>updateProfile('goal',e.target.value)}><option value="lose">Gradual weight loss</option><option value="maintain">Maintain weight</option><option value="gain">Gradual weight gain</option></select></label>
                  <label>Food preference<select value={profile.diet} onChange={e=>updateProfile('diet',e.target.value)}><option value="omnivore">No restriction</option><option value="vegetarian">Vegetarian</option><option value="vegan">Vegan</option></select></label>
                  <label>Movement needs<select value={profile.conditions} onChange={e=>updateProfile('conditions',e.target.value)}><option value="none">No specific adaptation</option><option value="mobility">Limited mobility / need seated options</option><option value="wheelchair">Wheelchair user</option></select></label>
                  <label>Injury area<select value={profile.injury} onChange={e=>updateProfile('injury',e.target.value)}><option value="none">No current injury</option><option value="shoulder">Shoulder / arm</option><option value="back">Back / neck</option><option value="hip">Hip</option><option value="knee">Knee / leg</option><option value="wrist">Wrist / hand</option><option value="other">Other / not sure</option></select></label>
                  <label className="wide-field">Foods you like (comma-separated)<input value={profile.foods} onChange={e=>updateProfile('foods',e.target.value)} placeholder="e.g. oats, rice, dal, tofu, banana"/></label>
                </div>
                <button className="primary-button" onClick={() => { setCalories(targetCalories); setResult(optimizeMeals({calories:targetCalories, proteinGoal:Math.round(Number(profile.weight)*1.4), fatFloor:40, fiberFloor:20, foods:personalizedFoods})); setPage('Personal plan'); setNotice('Your personalized estimates and food-filtered meal plan have been updated.'); }}>Calculate my plan</button>
              </Card>
              <div className="personal-stats">
                <div className="personal-stat"><span>Estimated BMI</span><strong>{Number.isFinite(bmi) && bmi > 0 ? bmi.toFixed(1) : '—'}</strong><small>BMI is a screening measure, not a complete health assessment.</small></div>
                <div className="personal-stat"><span>Estimated maintenance</span><strong>{maintenanceCalories.toLocaleString()} <small>kcal/day</small></strong><small>Approximate daily energy expenditure based on the details above.</small></div>
                <div className="personal-stat"><span>Goal starting target</span><strong>{targetCalories.toLocaleString()} <small>kcal/day</small></strong><small>Uses a modest adjustment; individual needs vary.</small></div>
              </div>
              <Card>
                <div className="section-kicker">ADAPTIVE MOVEMENT IDEAS</div><h2>{profile.conditions !== 'none' ? 'Accessible exercise options' : profile.injury !== 'none' ? 'Injury-aware movement guidance' : 'Suggested activity mix'}</h2>
                <p className="panel-desc">Choose only movements that feel comfortable and are appropriate for your abilities.</p>
                <div className="recommendation-list">{safeExercises.map((exercise,i)=><div className="recommendation-item" key={exercise}><span>{String(i+1).padStart(2,'0')}</span><b>{exercise}</b></div>)}</div>
                {(profile.injury !== 'none' || profile.conditions !== 'none') && <div className="safety-note"><ShieldCheck size={17}/><span>Safety first: this app cannot assess an injury or determine disability-specific suitability. Ask a qualified clinician or physiotherapist for a tailored plan. Stop if you feel pain, dizziness, numbness or worsening symptoms. For severe or sudden symptoms, seek urgent medical care.</span></div>}
              </Card>
              <Card>
                <div className="section-kicker">FOOD MATCH</div><h2>{profile.diet === 'vegan' ? 'Plant-based food options' : profile.diet === 'vegetarian' ? 'Vegetarian-friendly food options' : 'Food options for your preferences'}</h2>
                <p className="panel-desc">Matching items from the app's sample database. Values are approximate and should be checked against product labels.</p>
                <div className="food-match-grid">{personalizedFoods.length ? personalizedFoods.map(food=><div className="food-match" key={food.id}><b>{food.name}</b><span>{food.serving}</span><small>{food.calories} kcal · {food.protein} g protein</small></div>) : <p>No foods match these preferences. Try adding more comma-separated foods you like.</p>}</div>
                <div className="meal-result-summary"><h3>Current optimized meal combination</h3>
                  {result.selected && result.selected.length ? <><div className="food-match-grid">{result.selected.map((item,i)=><div className="food-match" key={item.food.id+'-'+i}><b>{item.food.name}</b><span>{item.qty} × {item.food.serving}</span><small>{Math.round(item.food.calories*item.qty)} kcal · {fmt(item.food.protein*item.qty)} g protein</small></div>)}</div><p className="panel-desc">Estimated total: {Math.round(result.totals.calories)} kcal · {fmt(result.totals.protein)} g protein. This is a sample combination, not a complete prescribed daily menu.</p></> : <p className="panel-desc">Use “Calculate my plan” to generate a meal combination matching your current food preferences.</p>}
                </div>
              </Card>
              <Card>
                <div className="panel-top"><div><div className="section-kicker">YOUR NEXT 7 DAYS</div><h2>Weekly starter plan</h2><p className="panel-desc">A flexible example schedule generated from your goal. Adjust intensity to your comfort and schedule.</p></div><div className="round-icon"><CalendarDays size={18}/></div></div>
                <div className="week-plan-grid">{['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((day,i)=>{const sessions=profile.injury!=='none'?['Clinician-approved movement only','Avoid loading the injured area','Gentle breathing if comfortable','Recovery / follow clinician advice','Clinician-approved activity only','Rest or approved activity','Rest and symptom check']:profile.conditions==='wheelchair'?['Comfortable seated strength','Seated cardio if suitable','Upper-body mobility (pain-free)','Recovery and breathing','Seated resistance-band work if suitable','Enjoyable adapted activity','Rest and weekly check-in']:profile.conditions==='mobility'?['Supported strength basics','Comfortable seated or supported cardio','Gentle mobility','Recovery and stretching if suitable','Adapted strength basics','Enjoyable accessible activity','Rest and weekly check-in']:['Full-body strength basics','Easy walk or seated cardio','Mobility + light strength','Recovery and gentle stretching','Full-body strength basics','Enjoyable cardio or adapted activity','Rest and weekly check-in'];const plant=profile.diet==='vegan'?'tofu/soya':'tofu/paneer';const protein=profile.diet==='omnivore'?'eggs/chicken/dal':profile.diet==='vegan'?'dal/chana/tofu':'dal/chana/paneer';const meals=[`Oats + fruit; ${protein}, rice and vegetables; ${plant} with roti`,'Idli + sambar; chana bowl; vegetable khichdi','Poha + sprouts; roti + dal; tofu and vegetables','Fruit + suitable yogurt alternative; rice + sambar; lentil soup',`Oats; chana + roti; ${plant} and vegetables`,'Dosa + sambar; rice + dal; beans and vegetables','Flexible balanced meals using your preferred foods'];return <div className="week-plan-day" key={day}><span>0{i+1}</span><b>{day}</b><strong>{sessions[i]}</strong><small>{meals[i]}</small></div>})}</div>
                <p className="panel-desc">This is a general planning template, not a clinical prescription. If you selected an injury or mobility adaptation, use only clinician-approved movements and replace unsuitable sessions with safe alternatives.</p>
              </Card>
              <Card>
                <div className="panel-top"><div><div className="section-kicker">MOVEMENT LIBRARY</div><h2>Exercise ideas & alternatives</h2><p className="panel-desc">Filter general exercise ideas by the kind of session you want.</p></div><div className="round-icon"><Dumbbell size={18}/></div></div>
                <div className="exercise-filter-row">{['All','Strength','Cardio','Mobility','Accessible'].map(x=><button key={x} className={`filter-chip ${exerciseFilter===x?'active':''}`} onClick={()=>setExerciseFilter(x)}>{x}</button>)}</div>
                <div className="exercise-library-grid">{[
                  {name:'Chair sit-to-stand',type:'Strength',detail:'2 sets of 6–10 comfortable repetitions; use support if needed.'},
                  {name:'Wall push-up',type:'Strength',detail:'2 sets of 6–12; keep movements pain-free.'},
                  {name:'Resistance-band row',type:'Strength',detail:'2 sets of 8–12; use a secure band anchor.'},
                  {name:'Comfortable walking',type:'Cardio',detail:'Start with 5–15 minutes at a conversational pace.'},
                  {name:'Seated arm movement',type:'Accessible',detail:'Move gently through a comfortable range; stop if symptoms appear.'},
                  {name:'Wheelchair-friendly arm cycle',type:'Accessible',detail:'Use only if equipment and shoulder function are suitable.'},
                  {name:'Gentle shoulder rolls',type:'Mobility',detail:'Slow, small circles without forcing range.'},
                  {name:'Supported breathing',type:'Mobility',detail:'Relaxed breathing for 2–5 minutes.'}
                ].filter(x=>exerciseFilter==='All'||x.type===exerciseFilter).map(x=><div className="exercise-library-card" key={x.name}><span>{x.type}</span><b>{x.name}</b><small>{x.detail}</small></div>)}</div>
                <div className="safety-note"><ShieldCheck size={17}/><span>Exercises are general examples. The app cannot determine whether a movement is safe for a specific disability or injury. Seek advice from a qualified clinician or physiotherapist before exercising with an active injury.</span></div>
              </Card>
            </div>
          )}

          {/* ================================================= */}
          {/* PROGRESS, HABITS AND BUILT-IN FITNESS GUIDE */}
          {/* ================================================= */}
          {page === 'Progress & habits' && (
            <div className="personal-layout">
              <Card>
                <div className="panel-top"><div><div className="section-kicker">DAILY CHECK-IN</div><h2>Build consistency, one day at a time</h2><p className="panel-desc">Your records are saved in this browser on this device.</p></div><div className="round-icon"><Activity size={18}/></div></div>
                <div className="personal-form-grid">
                  <label>Today's weight (kg)<input type="number" min="25" max="350" step="0.1" value={logWeight} onChange={e=>setLogWeight(e.target.value)} placeholder={String(profile.weight)}/></label>
                  <label>Water (litres)<input type="number" min="0" max="10" step="0.25" value={dailyHabits.water} onChange={e=>setDailyHabits({...dailyHabits,water:Number(e.target.value)})}/></label>
                  <label>Sleep (hours)<input type="number" min="0" max="24" step="0.5" value={dailyHabits.sleep} onChange={e=>setDailyHabits({...dailyHabits,sleep:Number(e.target.value)})}/></label>
                  <label>Workouts completed today<input type="number" min="0" max="10" value={dailyHabits.workouts} onChange={e=>setDailyHabits({...dailyHabits,workouts:Number(e.target.value)})}/></label>
                  <label>Calories consumed (estimate)<input type="number" min="0" value={dailyHabits.calories} onChange={e=>setDailyHabits({...dailyHabits,calories:Number(e.target.value)})}/></label>
                  <label>Protein (g)<input type="number" min="0" value={dailyHabits.protein} onChange={e=>setDailyHabits({...dailyHabits,protein:Number(e.target.value)})}/></label>
                  <label>Carbohydrates (g)<input type="number" min="0" value={dailyHabits.carbs} onChange={e=>setDailyHabits({...dailyHabits,carbs:Number(e.target.value)})}/></label>
                  <label>Fat (g)<input type="number" min="0" value={dailyHabits.fat} onChange={e=>setDailyHabits({...dailyHabits,fat:Number(e.target.value)})}/></label>
                  <label>Fiber (g)<input type="number" min="0" value={dailyHabits.fiber} onChange={e=>setDailyHabits({...dailyHabits,fiber:Number(e.target.value)})}/></label>
                </div>
                <div className="progress-actions"><button className="primary-button" onClick={()=>{const entry={date:new Date().toLocaleDateString(),weight:Number(logWeight||profile.weight),...dailyHabits};setProgressLog(old=>[...old.filter(x=>x.date!==entry.date),entry].slice(-30));setProfile(old=>({...old,weight:Number(logWeight||old.weight)}));setNotice('Today’s check-in was saved on this device.')}}>Save today's check-in</button><button className="secondary-button" onClick={()=>window.print()}>Export report / Save as PDF</button></div>
              </Card>
              <div className="personal-stats">
                <div className="personal-stat"><span>Water today</span><strong>{Number(dailyHabits.water||0).toFixed(1)} <small>L</small></strong><small>Hydration needs vary by climate, activity and health.</small></div>
                <div className="personal-stat"><span>Sleep logged</span><strong>{Number(dailyHabits.sleep||0)} <small>hrs</small></strong><small>Use this as a habit log, not a medical assessment.</small></div>
                <div className="personal-stat"><span>Check-ins saved</span><strong>{progressLog.length}</strong><small>Up to 30 daily records are retained in this browser.</small></div>
              </div>
              <Card>
                <div className="panel-top"><div><div className="section-kicker">PROGRESS HISTORY</div><h2>Weight trend</h2><p className="panel-desc">Recorded weights are shown in chronological order.</p></div><div className="round-icon"><BarChart3 size={18}/></div></div>
                {progressLog.length ? <div className="weight-chart">{progressLog.map((entry,i)=>{const values=progressLog.map(x=>Number(x.weight)||0);const min=Math.min(...values)-2;const max=Math.max(...values)+2;const height=Math.max(12,((Number(entry.weight)-min)/(max-min||1))*100);return <div className="weight-chart-item" key={entry.date+'-'+i}><div className="weight-bar" style={{height:`${height}%`}} title={`${entry.weight} kg`}/><b>{entry.weight} kg</b><small>{entry.date}</small></div>})}</div> : <div className="empty-progress"><BarChart3 size={28}/><b>Your progress chart will appear here</b><span>Save your first daily check-in to start tracking trends.</span></div>}
                {progressLog.length>0&&<div className="history-list">{progressLog.slice().reverse().map((entry,i)=><div className="history-row" key={entry.date+'-'+i}><span>{entry.date}</span><b>{entry.weight} kg</b><small>{entry.calories||0} kcal · {entry.protein||0} g protein · {entry.workouts||0} workouts</small></div>)}</div>}
              </Card>
              <Card>
                <div className="panel-top"><div><div className="section-kicker">SMART FOOD SWAPS</div><h2>Simple meal substitutions</h2><p className="panel-desc">Ideas to help use familiar foods while respecting dietary preferences.</p></div><div className="round-icon"><Leaf size={18}/></div></div>
                <div className="swap-grid">{(profile.diet==='vegan'?[['Paneer','Tofu or cooked soya chunks'],['Curd','Unsweetened soy yogurt'],['Egg','Tofu scramble']]:profile.diet==='vegetarian'?[['Chicken','Chana, dal, paneer or tofu'],['Fish','Paneer or tofu'],['Meat-based protein','Soya chunks or lentils']]:[['White rice','Brown rice or millets (portion-adjusted)'],['Sugary snack','Fruit with nuts (portion-adjusted)'],['Chicken','Eggs, fish, dal or tofu']]).map(pair=><div className="swap-row" key={pair[0]}><span>{pair[0]}</span><span className="swap-arrow">→</span><b>{pair[1]}</b></div>)}</div>
              </Card>
              <Card>
                <div className="panel-top"><div><div className="section-kicker">FITORA GUIDE</div><h2>Ask the fitness guide</h2><p className="panel-desc">A rule-based helper for general planning questions; it does not call an external AI service.</p></div><div className="round-icon"><Sparkles size={18}/></div></div>
                <div className="assistant-row"><input value={assistantQuestion} onChange={e=>setAssistantQuestion(e.target.value)} placeholder="e.g. How can I add more plant protein?"/><button className="primary-button" onClick={()=>{const q=assistantQuestion.toLowerCase();let answer='Start with one manageable habit, review your weekly trend, and adjust gradually. For personal medical or injury advice, consult a qualified professional.';if(/protein|vegan|vegetarian/.test(q))answer=profile.diet==='vegan'?'Try dal, chana, tofu, soya chunks, beans, oats and nuts; compare package labels for actual protein per serving.':'Try dal, chana, paneer, tofu, eggs (if you eat them), beans and yogurt; compare labels and serving sizes.';else if(/weight|bmi|lose|gain/.test(q))answer=`Your estimated BMI is ${Number.isFinite(bmi)?bmi.toFixed(1):'not available'} and your starting calorie estimate is about ${targetCalories} kcal/day. These are rough estimates; monitor trends and seek a dietitian for individualized needs.`;else if(/water|hydration/.test(q))answer='Log water consistently and drink to thirst; needs vary with heat, activity and medical conditions. Follow clinician advice if you have fluid restrictions.';else if(/injur|pain|wheelchair|disab|mobility/.test(q))answer='The app cannot assess injuries or disability-specific exercise safety. Avoid movements that cause symptoms and ask a clinician or physiotherapist for individualized options.';else if(/meal|food|diet|indian/.test(q))answer='Use the meal optimizer with your food preferences. The sample database includes foods such as idli, dosa, roti, chana, sambar, poha, dal and soya chunks; nutrition values are approximate.';setAssistantAnswer(answer)}}>Ask</button></div>
                <div className="assistant-answer"><Sparkles size={16}/><span>{assistantAnswer}</span></div>
              </Card>
            </div>
          )}

          {/* ================================================= */}
          {/* MEAL OPTIMIZER */}
          {/* ================================================= */}

          {page === 'Meal optimizer' && (

            <div className="meal-layout">

              <div className="left-stack">

                {/* NUTRITION CONTROLS */}

                <Card>

                  <div className="panel-top">

                    <div>

                      <div className="section-kicker">
                        OPTIMIZATION CONTROLS
                      </div>

                      <h2>
                        Set your nutrition targets
                      </h2>

                      <p className="panel-desc">
                        Adjust constraints, then run the hybrid knapsack optimizer.
                      </p>

                    </div>

                    <div className="round-icon">
                      <Target size={18} />
                    </div>

                  </div>


                  <div className="form-grid">

                    <label>

                      Daily calorie budget

                      <div className="input-wrap">

                        <input
                          type="number"
                          min="500"
                          max="5000"
                          value={calories}
                          onChange={e =>
                            setCalories(
                              e.target.value
                            )
                          }
                        />

                        <span>
                          kcal
                        </span>

                      </div>

                      <input
                        className="range"
                        type="range"
                        min="1000"
                        max="3500"
                        step="50"
                        value={calories}
                        onChange={e =>
                          setCalories(
                            e.target.value
                          )
                        }
                      />

                    </label>


                    <label>

                      Protein goal

                      <div className="input-wrap">

                        <input
                          type="number"
                          min="20"
                          max="250"
                          value={proteinGoal}
                          onChange={e =>
                            setProteinGoal(
                              e.target.value
                            )
                          }
                        />

                        <span>
                          grams
                        </span>

                      </div>

                      <input
                        className="range"
                        type="range"
                        min="40"
                        max="220"
                        step="5"
                        value={proteinGoal}
                        onChange={e =>
                          setProteinGoal(
                            e.target.value
                          )
                        }
                      />

                    </label>


                    <label>

                      Minimum fat

                      <div className="input-wrap">

                        <input
                          type="number"
                          min="0"
                          max="120"
                          value={fatFloor}
                          onChange={e =>
                            setFatFloor(
                              e.target.value
                            )
                          }
                        />

                        <span>
                          grams
                        </span>

                      </div>

                    </label>


                    <label>

                      Minimum fiber

                      <div className="input-wrap">

                        <input
                          type="number"
                          min="0"
                          max="60"
                          value={fiberFloor}
                          onChange={e =>
                            setFiberFloor(
                              e.target.value
                            )
                          }
                        />

                        <span>
                          grams
                        </span>

                      </div>

                    </label>

                  </div>


                  <button
                    className="primary-button full-button"
                    onClick={runOptimizer}
                  >

                    <Sparkles size={17} />

                    Run meal optimization

                    <ArrowUpRight size={16} />

                  </button>


                  <p className="microcopy">

                    <ShieldCheck size={13} />

                    Uses the included sample food database. Values are illustrative.

                  </p>

                </Card>


                {/* FOOD DATABASE */}

                <Card>

                  <div className="panel-top">

                    <div>

                      <div className="section-kicker">
                        AVAILABLE INGREDIENTS
                      </div>

                      <h2>

                        Food database{' '}

                        <span className="count-pill">
                          {visibleFoods.length}
                        </span>

                      </h2>

                    </div>

                  </div>


                  <div className="search-box">

                    <Search size={16} />

                    <input
                      placeholder="Search foods or categories..."
                      value={search}
                      onChange={e =>
                        setSearch(
                          e.target.value
                        )
                      }
                    />

                  </div>


                  <div className="database-list">

                    {visibleFoods.map(
                      food => (

                        <div
                          className="database-row"
                          key={food.id}
                        >

                          <div>

                            <b>
                              {food.name}
                            </b>

                            <small>
                              {food.category}
                              {' · '}
                              {food.serving}
                              {' · '}
                              {food.divisible
                                ? 'Portion-flexible'
                                : 'Whole serving'}
                            </small>

                          </div>


                          <div>

                            <b>
                              {food.calories}
                            </b>

                            <small>
                              kcal
                            </small>

                          </div>


                          <div>

                            <b>
                              {food.protein}g
                            </b>

                            <small>
                              protein
                            </small>

                          </div>


                          {food.custom ? (

                            <button
                              className="delete-small-button"
                              onClick={() =>
                                removeCustomFood(
                                  food.id
                                )
                              }
                              title="Remove custom food"
                            >
                              ×
                            </button>

                          ) : (
                            <span />
                          )}

                        </div>

                      )
                    )}

                  </div>

                </Card>


                {/* ADD CUSTOM FOOD */}

                <Card>

                  <div className="panel-top">

                    <div>

                      <div className="section-kicker">
                        CUSTOM FOOD
                      </div>

                      <h2>
                        Add your own food
                      </h2>

                      <p className="panel-desc">
                        Add a food with its nutrition values and use it in optimization.
                      </p>

                    </div>

                    <div className="round-icon">
                      <Plus size={18} />
                    </div>

                  </div>


                  <div className="form-grid">

                    <label>

                      Food name

                      <div className="input-wrap">

                        <input
                          type="text"
                          placeholder="e.g. Salmon"
                          value={
                            foodForm.name
                          }
                          onChange={e =>
                            setFoodForm({
                              ...foodForm,
                              name:
                                e.target.value
                            })
                          }
                        />

                      </div>

                    </label>


                    <label>

                      Category

                      <div className="input-wrap">

                        <select
                          value={
                            foodForm.category
                          }
                          onChange={e =>
                            setFoodForm({
                              ...foodForm,
                              category:
                                e.target.value
                            })
                          }
                        >

                          <option value="Protein">
                            Protein
                          </option>

                          <option value="Carbs">
                            Carbs
                          </option>

                          <option value="Fruit">
                            Fruit
                          </option>

                          <option value="Vegetables">
                            Vegetables
                          </option>

                          <option value="Dairy">
                            Dairy
                          </option>

                          <option value="Healthy fats">
                            Healthy fats
                          </option>

                          <option value="Other">
                            Other
                          </option>

                        </select>

                      </div>

                    </label>


                    <label>

                      Serving

                      <div className="input-wrap">

                        <input
                          type="text"
                          placeholder="e.g. 100 g"
                          value={
                            foodForm.serving
                          }
                          onChange={e =>
                            setFoodForm({
                              ...foodForm,
                              serving:
                                e.target.value
                            })
                          }
                        />

                      </div>

                    </label>


                    <label>

                      Calories

                      <div className="input-wrap">

                        <input
                          type="number"
                          min="0"
                          placeholder="200"
                          value={
                            foodForm.calories
                          }
                          onChange={e =>
                            setFoodForm({
                              ...foodForm,
                              calories:
                                e.target.value
                            })
                          }
                        />

                        <span>
                          kcal
                        </span>

                      </div>

                    </label>


                    <label>

                      Protein

                      <div className="input-wrap">

                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="20"
                          value={
                            foodForm.protein
                          }
                          onChange={e =>
                            setFoodForm({
                              ...foodForm,
                              protein:
                                e.target.value
                            })
                          }
                        />

                        <span>
                          grams
                        </span>

                      </div>

                    </label>


                    <label>

                      Fat

                      <div className="input-wrap">

                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="5"
                          value={
                            foodForm.fat
                          }
                          onChange={e =>
                            setFoodForm({
                              ...foodForm,
                              fat:
                                e.target.value
                            })
                          }
                        />

                        <span>
                          grams
                        </span>

                      </div>

                    </label>


                    <label>

                      Fiber

                      <div className="input-wrap">

                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="3"
                          value={
                            foodForm.fiber
                          }
                          onChange={e =>
                            setFoodForm({
                              ...foodForm,
                              fiber:
                                e.target.value
                            })
                          }
                        />

                        <span>
                          grams
                        </span>

                      </div>

                    </label>


                    <label>

                      Carbs

                      <div className="input-wrap">

                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="10"
                          value={
                            foodForm.carbs
                          }
                          onChange={e =>
                            setFoodForm({
                              ...foodForm,
                              carbs:
                                e.target.value
                            })
                          }
                        />

                        <span>
                          grams
                        </span>

                      </div>

                    </label>


                    <label>

                      Maximum portions

                      <div className="input-wrap">

                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={
                            foodForm.max
                          }
                          onChange={e =>
                            setFoodForm({
                              ...foodForm,
                              max:
                                e.target.value
                            })
                          }
                        />

                        <span>
                          portions
                        </span>

                      </div>

                    </label>


                    <label className="checkbox-label">

                      <input
                        type="checkbox"
                        checked={
                          foodForm.divisible
                        }
                        onChange={e =>
                          setFoodForm({
                            ...foodForm,
                            divisible:
                              e.target.checked
                          })
                        }
                      />

                      Portion-flexible food

                    </label>

                  </div>


                  <button
                    className="primary-button full-button"
                    onClick={
                      addCustomFood
                    }
                  >

                    <Plus size={17} />

                    Add food to database

                  </button>


                  <p className="microcopy">

                    <ShieldCheck size={13} />

                    Your custom food will be available to the optimizer.

                  </p>

                </Card>

              </div>


              {/* RIGHT SIDE */}

              <div className="right-stack">

                <Card className="results-card">

                  <div className="panel-top">

                    <div>

                      <div className="section-kicker">
                        OPTIMIZATION OUTPUT
                      </div>

                      <h2>
                        Your meal combination
                      </h2>

                    </div>

                    <span
                      className={`result-badge ${
                        result.feasible
                          ? 'good'
                          : ''
                      }`}
                    >
                      {result.feasible
                        ? 'FEASIBLE'
                        : 'REVIEW'}
                    </span>

                  </div>


                  <div className="result-big">

                    <div>

                      <span>
                        Protein selected
                      </span>

                      <strong>

                        {fmt(
                          totals.protein
                        )}

                        <small>
                          {' '}g
                        </small>

                      </strong>

                      <p>

                        {totals.protein >=
                        proteinGoal
                          ? 'Protein goal reached'
                          : `${fmt(
                              proteinGoal -
                                totals.protein
                            )} g below your goal`}

                      </p>

                    </div>


                    <div className="result-spark">

                      <Zap size={22} />

                    </div>

                  </div>


                  <div className="result-metrics">

                    <div>

                      <span>
                        Calories
                      </span>

                      <b>

                        {Math.round(
                          totals.calories
                        )}

                        <small>
                          {' '}/ {calories}
                        </small>

                      </b>

                      <div className="metric-line">

                        <i
                          style={{
                            width:
                              `${Math.min(
                                100,
                                totals.calories /
                                  Math.max(
                                    1,
                                    calories
                                  ) *
                                  100
                              )}%`
                          }}
                        />

                      </div>

                    </div>


                    <div>

                      <span>
                        Fat floor
                      </span>

                      <b>

                        {fmt(
                          totals.fat
                        )}

                        <small>
                          {' '}/ {fatFloor} g
                        </small>

                      </b>

                      <div className="metric-line pink-line">

                        <i
                          style={{
                            width:
                              `${Math.min(
                                100,
                                totals.fat /
                                  Math.max(
                                    1,
                                    fatFloor
                                  ) *
                                  100
                              )}%`
                          }}
                        />

                      </div>

                    </div>


                    <div>

                      <span>
                        Fiber floor
                      </span>

                      <b>

                        {fmt(
                          totals.fiber
                        )}

                        <small>
                          {' '}/ {fiberFloor} g
                        </small>

                      </b>

                      <div className="metric-line green-line">

                        <i
                          style={{
                            width:
                              `${Math.min(
                                100,
                                totals.fiber /
                                  Math.max(
                                    1,
                                    fiberFloor
                                  ) *
                                  100
                              )}%`
                          }}
                        />

                      </div>

                    </div>

                  </div>


                  <div className="algorithm-note">

                    <div className="algo-icon">
                      <Zap size={16} />
                    </div>

                    <div>

                      <b>
                        Hybrid knapsack search
                      </b>

                      <p>
                        Explored{' '}
                        {result.explored.toLocaleString()}
                        {' '}
                        candidate states. Flexible foods can use multiple portions; whole foods are limited to one unit each.
                      </p>

                    </div>

                  </div>

                </Card>


                <Card>

                  <div className="panel-top">

                    <div>

                      <div className="section-kicker">
                        SELECTED FOODS
                      </div>

                      <h2>
                        Optimized portions
                      </h2>

                    </div>

                    <span className="count-pill">
                      {result.selected.length}
                      {' '}items
                    </span>

                  </div>


                  {result.selected.length ? (

                    <div className="selected-foods">

                      {result.selected.map(
                        ({
                          food,
                          qty
                        }) => (

                          <div
                            className="selected-row"
                            key={food.id}
                          >

                            <div className="selected-mark">
                              <Check size={15} />
                            </div>

                            <div className="selected-name">

                              <b>
                                {food.name}
                              </b>

                              <small>
                                {food.serving}
                                {' × '}
                                {qty}
                              </small>

                            </div>

                            <div className="selected-values">

                              <b>
                                {Math.round(
                                  food.calories *
                                    qty
                                )}
                                {' '}kcal
                              </b>

                              <small>
                                {fmt(
                                  food.protein *
                                    qty
                                )}
                                g protein
                              </small>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <div className="empty-state">
                      No foods selected. Increase the calorie budget or lower the nutrient floors.
                    </div>

                  )}

                </Card>

              </div>

            </div>

          )}


          {/* ================================================= */}
          {/* WORKOUT PLANNER */}
          {/* ================================================= */}

          {page === 'Workout planner' && (

            <div className="workout-layout">

              <Card className="workout-settings">

                <div className="panel-top">

                  <div>

                    <div className="section-kicker">
                      WEEKLY SCHEDULER
                    </div>

                    <h2>
                      Choose your training days
                    </h2>

                    <p className="panel-desc">
                      Coloring groups with recovery conflicts into different workout days.
                    </p>

                  </div>

                  <div className="round-icon">
                    <Dumbbell size={18} />
                  </div>

                </div>


                <label className="select-label">

                  Training days per week

                  <select
                    value={days}
                    onChange={e =>
                      setDays(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  >

                    {[3, 4, 5, 6, 7].map(
                      n => (

                        <option
                          key={n}
                          value={n}
                        >
                          {n} days per week
                        </option>

                      )
                    )}

                  </select>

                </label>


                <div className="day-picker">

                  {[
                    'Mon',
                    'Tue',
                    'Wed',
                    'Thu',
                    'Fri',
                    'Sat',
                    'Sun'
                  ].map(
                    (d, i) => (

                      <div
                        key={d}
                        className={`day-chip ${
                          i < days
                            ? 'selected'
                            : ''
                        }`}
                      >

                        <span>
                          {d}
                        </span>

                        {i < days && (
                          <Check size={13} />
                        )}

                      </div>

                    )
                  )}

                </div>


                <button
                  className="primary-button full-button"
                  onClick={
                    runSchedule
                  }
                >

                  <Sparkles size={17} />

                  Generate weekly split

                  <ArrowUpRight size={16} />

                </button>


                {/* CUSTOM EXERCISES */}

                <div className="custom-exercise-box">

                  <div className="section-kicker">
                    CUSTOM EXERCISES
                  </div>

                  <h3>
                    Add exercise to a specific day
                  </h3>

                  <p>
                    Add your own exercises without changing the generated workout plan.
                  </p>


                  <select
                    className="custom-select"
                    value={exerciseDay}
                    onChange={e =>
                      setExerciseDay(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  >

                    {[
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                      'Sunday'
                    ].map(
                      (
                        day,
                        index
                      ) => (

                        <option
                          key={day}
                          value={index}
                        >
                          {day}
                        </option>

                      )
                    )}

                  </select>


                  <div className="input-wrap">

                    <input
                      type="text"
                      placeholder="e.g. Dumbbell fly"
                      value={
                        exerciseName
                      }
                      onChange={e =>
                        setExerciseName(
                          e.target.value
                        )
                      }
                      onKeyDown={e => {

                        if (
                          e.key ===
                          'Enter'
                        ) {
                          addExercise();
                        }

                      }}
                    />

                  </div>


                  <button
                    className="primary-button full-button"
                    onClick={
                      addExercise
                    }
                  >

                    <Plus size={17} />

                    Add exercise

                  </button>

                </div>


                <div className="algorithm-note">

                  <div className="algo-icon">
                    <Zap size={16} />
                  </div>

                  <div>

                    <b>
                      Welsh–Powell graph coloring
                    </b>

                    <p>
                      Muscle groups are ordered by conflict degree and assigned to day colors. This is a simplified planning model, not individualized medical guidance.
                    </p>

                  </div>

                </div>

              </Card>


              <div className="schedule-column">

                <div className="schedule-header">

                  <div>

                    <div className="section-kicker">
                      YOUR GENERATED PLAN
                    </div>

                    <h2>
                      Week at a glance
                    </h2>

                  </div>

                  <span className="live-tag">

                    <span />

                    {
                      schedule.filter(
                        d =>
                          d.groups.length
                      ).length
                    }

                    {' '}ACTIVE DAYS

                  </span>

                </div>


                <div className="schedule-grid">

                  {schedule.map(
                    d => (

                      <Card
                        key={d.name}
                        className={`day-card ${
                          d.groups.length
                            ? ''
                            : 'rest-card'
                        }`}
                      >

                        <div className="day-card-head">

                          <div>

                            <span className="day-index">
                              DAY 0
                              {d.day + 1}
                            </span>

                            <h3>
                              {d.name}
                            </h3>

                          </div>


                          <div
                            className={`day-symbol ${
                              d.groups.length
                                ? ''
                                : 'rest-symbol'
                            }`}
                          >

                            {d.groups.length ? (
                              <Dumbbell
                                size={17}
                              />
                            ) : (
                              <Moon
                                size={17}
                              />
                            )}

                          </div>

                        </div>


                        {d.groups.length ? (

                          <>

                            <div className="group-count">

                              {d.groups.length}

                              {' '}muscle group

                              {d.groups.length >
                              1
                                ? 's'
                                : ''}

                            </div>


                            {d.groups.map(
                              group => (

                                <div
                                  className="muscle-group"
                                  key={
                                    group.name
                                  }
                                >

                                  <b>
                                    {group.name}
                                  </b>

                                  <ul>

                                    {group.exercises.map(
                                      exercise => (

                                        <li
                                          key={
                                            exercise
                                          }
                                        >
                                          {exercise}
                                        </li>

                                      )
                                    )}

                                  </ul>

                                </div>

                              )
                            )}


                            {/* USER EXERCISES */}

                            {(customExercises[
                              d.name
                            ] || []).length >
                              0 && (

                              <div className="muscle-group custom-user-exercises">

                                <b>
                                  Your exercises
                                </b>

                                <ul>

                                  {customExercises[
                                    d.name
                                  ].map(
                                    exercise => (

                                      <li
                                        key={
                                          exercise
                                        }
                                        className="custom-exercise-item"
                                      >

                                        <span>
                                          {exercise}
                                        </span>

                                        <button
                                          onClick={() =>
                                            removeExercise(
                                              d.name,
                                              exercise
                                            )
                                          }
                                          title="Remove exercise"
                                        >
                                          ×
                                        </button>

                                      </li>

                                    )
                                  )}

                                </ul>

                              </div>

                            )}

                          </>

                        ) : (

                          <>

                            {/* USER EXERCISES ON REST DAYS */}

                            {(customExercises[
                              d.name
                            ] || []).length >
                            0 ? (

                              <div className="custom-rest-day">

                                <div className="rest-content">

                                  <Moon size={20} />

                                  <b>
                                    Recovery day
                                  </b>

                                  <p>
                                    Custom exercises added
                                  </p>

                                </div>


                                <div className="muscle-group custom-user-exercises">

                                  <b>
                                    Your exercises
                                  </b>

                                  <ul>

                                    {customExercises[
                                      d.name
                                    ].map(
                                      exercise => (

                                        <li
                                          key={
                                            exercise
                                          }
                                          className="custom-exercise-item"
                                        >

                                          <span>
                                            {exercise}
                                          </span>

                                          <button
                                            onClick={() =>
                                              removeExercise(
                                                d.name,
                                                exercise
                                              )
                                            }
                                          >
                                            ×
                                          </button>

                                        </li>

                                      )
                                    )}

                                  </ul>

                                </div>

                              </div>

                            ) : (

                              <div className="rest-content">

                                <Moon size={20} />

                                <b>
                                  Recovery day
                                </b>

                                <p>
                                  Mobility, hydration and sleep.
                                </p>

                              </div>

                            )}

                          </>

                        )}

                      </Card>

                    )
                  )}

                </div>


                <div className="schedule-footnote">

                  <CircleHelp size={15} />

                  <span>
                    Schedules are generated from a small demonstration conflict graph. Always adjust for your experience, equipment and recovery.
                  </span>

                </div>

              </div>

            </div>

          )}


          {/* FOOTER */}

          <footer className="footer">

            <span>

              © 2026 FITORA

              <i>
                ·
              </i>

              SMART FITNESS OPTIMIZATION

            </span>


            <span>

              <span className="footer-dot" />

              Built with algorithmic thinking

            </span>

          </footer>


        </div>

      </main>

    </div>

  );
}


createRoot(
  document.getElementById('root')
).render(

  <React.StrictMode>
    <App />
  </React.StrictMode>

);