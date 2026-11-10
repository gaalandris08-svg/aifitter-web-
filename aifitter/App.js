import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text as RNText, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, TextInput, Alert, Modal, useWindowDimensions, useColorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GREEN = '#B6F36A';
const BG = '#10120F';
const CARD = '#1C201A';
const MUTED = '#92998C';
const STORAGE_KEY = '@aifit_user_data_v4';

const LanguageContext = React.createContext('en');
const AccessibilityContext = React.createContext({ textSize: 'normal', highContrast: false, reduceMotion: false });
const HU = {
  'YOUR PERSONAL FITNESS PLATFORM':'A TE SZEMÉLYES FITNESZPLATFORMOD',
  'Your journey starts here. 💪':'Itt kezdődik az utad. 💪',
  "Let's get stronger.":'Legyünk erősebbek!',
  'Your goal:':'Célod:', 'Build muscle':'Izomépítés', 'Lose body fat':'Testzsír csökkentése',
  'Body recomposition':'Testkompozíció javítása', 'Improve overall fitness':'Általános fittség javítása',
  'Create your fitness profile':'Hozd létre a fitneszprofilodat',
  'Get a personalized experience.':'Személyre szabott élmény vár.',
  'PERSONALIZE MY PLAN →':'TERV SZEMÉLYRE SZABÁSA →',
  'YOUR FITNESS JOURNEY':'A TE FITNESZUTAD', 'Become your strongest self.':'Válj önmagad legerősebb változatává!',
  'Small steps. Consistent progress.':'Apró lépések. Folyamatos fejlődés.',
  'START TRAINING →':'EDZÉS INDÍTÁSA →', 'Day streak':'Napja sorozat', 'Workouts':'Edzések',
  'Total XP':'Összes XP', 'Your level':'Szinted', 'This week\'s activity':'E heti aktivitás',
  'Daily hydration':'Napi folyadékbevitel', 'Water intake':'Vízbevitel', 'ADD GLASS':'POHÁR HOZZÁADÁSA',
  "Today's nutrition":"Mai táplálkozás", 'Daily calorie progress':'Napi kalóriacél teljesítése',
  'OPEN NUTRITION →':'TÁPLÁLKOZÁS MEGNYITÁSA →', 'Your weekly workout plan':'Heti edzésterved',
  'PERSONALIZED':'SZEMÉLYRE SZABOTT', 'recommended exercises':'ajánlott gyakorlat',
  'AI Assistant':'AI-asszisztens', 'COMING SOON':'HAMAROSAN', 'COMING IN THE FUTURE':'A JÖVŐBEN ÉRKEZIK',
  'An intelligent AI assistant is coming soon to BIFIT.':'Hamarosan egy intelligens AI-asszisztens érkezik a BIFIT-be.',
  'YOUR TRAINING':'EDZÉSEID', 'Workouts':'Edzések', 'Build strength. Track progress. Improve every day.':'Építs erőt. Kövesd a fejlődésed. Fejlődj minden nap.',
  'YOUR PERSONAL PLAN':'SZEMÉLYES TERVED', 'Build your routine':'Állítsd össze a rutinod',
  'Complete your profile to personalize training.':'Töltsd ki a profilod a személyre szabott edzéshez.',
  'Your weekly schedule':'Heti beosztásod', 'TRAINING DAYS':'EDZÉSNAP', 'TRAIN':'EDZÉS', 'REST':'PIHENŐ',
  'SCHEDULED WORKOUT':'TERVEZETT EDZÉS', 'exercises · Based on your profile and equipment':'gyakorlat · A profilod és felszerelésed alapján',
  'Rest day 🌿':'Pihenőnap 🌿', 'Recovery is part of progress. Take a rest day or try a gentle stretching routine.':'A regeneráció is a fejlődés része. Pihenj, vagy próbálj ki egy könnyű nyújtást.',
  'OPEN STRETCHING →':'NYÚJTÁS MEGNYITÁSA →', "Today's workout session":"Mai edzésed", 'Workout completed today. Great job!':'A mai edzés kész. Szép munka!',
  'Mark each exercise when you finish it.':'Jelöld meg a gyakorlatokat, amikor befejezted őket.',
  'START WORKOUT SESSION →':'EDZÉS INDÍTÁSA →', 'SESSION IN PROGRESS':'EDZÉS FOLYAMATBAN',
  'exercises completed':'gyakorlat teljesítve', 'COMPLETE WORKOUT + XP':'EDZÉS BEFEJEZÉSE + XP',
  'CANCEL SESSION':'EDZÉS MEGSZAKÍTÁSA', 'Exercise library':'Gyakorlatkönyvtár',
  'Search exercises...':'Gyakorlat vagy izom keresése...', 'All':'Összes', 'Chest':'Mell', 'Back':'Hát',
  'Shoulders':'Váll', 'Arms':'Kar', 'Legs':'Láb', 'Core':'Törzs', 'Cardio':'Kardió', 'Glutes':'Farizom',
  'VIEW →':'MEGNÉZÉS →', 'VIEW':'MEGNÉZÉS', 'Workout history':'Edzéstörténet', 'SESSIONS':'EDZÉS',
  'exercises completed':'gyakorlat teljesítve', 'FUEL YOUR BODY':'TÁPLÁLD A TESTED', 'Nutrition':'Táplálkozás',
  'Track your food and understand your daily intake.':'Kövesd az étkezéseidet és a napi beviteledet.',
  'DAILY CALORIES':'NAPI KALÓRIA', 'Macronutrients':'Makrotápanyagok', 'TODAY':'MA',
  'Personalized daily targets':'Személyre szabott napi célok', 'ESTIMATES':'BECSLÉSEK',
  'Targets are estimated from your profile using the male Mifflin–St Jeor equation. Actual needs vary.':'A célértékek a profilod alapján, a Mifflin–St Jeor képlettel becsültek. A tényleges szükséglet eltérhet.',
  'Complete your profile to calculate estimated calorie and macro targets.':'Töltsd ki a profilod a becsült kalória- és makrócélok kiszámításához.',
  'Calorie goal':'Kalóriacél', 'Protein goal':'Fehérjecél', 'Carbs goal':'Szénhidrátcél', 'Fat goal':'Zsírcél', 'Water goal':'Vízbevitel cél',
  'RESET TO PROFILE ESTIMATES':'PROFIL SZERINTI CÉLOK VISSZAÁLLÍTÁSA',
  'Snack & meal recommendations':'Snack- és ételajánlások', 'PERSONALIZED IDEAS':'SZEMÉLYRE SZABOTT ÖTLETEK',
  'Your remaining targets':'Hátralévő napi kereted', 'Suggestions are flexible ideas, not strict meal timing rules.':'Az ajánlások ötletek, nem kötelező étkezési időpontok.',
  'WHEN:':'MIKOR:', '+ ADD TO FOOD DIARY':'+ HOZZÁADÁS AZ ÉTKEZÉSI NAPLÓHOZ', 'Quick meal presets':'Gyors ételválasztás', 'QUICK ADD':'GYORS HOZZÁADÁS',
  'Search quick meals...':'Gyors ételek keresése...', 'Custom food':'Egyéni étel', 'MANUAL ENTRY':'KÉZI RÖGZÍTÉS',
  'Food name':'Étel neve', 'Calories':'Kalória', 'Protein (g)':'Fehérje (g)', 'Carbs (g)':'Szénhidrát (g)', 'Fat (g)':'Zsír (g)',
  'ADD CUSTOM FOOD →':'EGYÉNI ÉTEL HOZZÁADÁSA →', "Today's food diary":"Mai étkezési napló", 'No meals added yet.':'Még nincs rögzített étkezés.', 'REMOVE':'TÖRLÉS',
  'Hydration':'Folyadékbevitel', 'DAILY TRACKER':'NAPI KÖVETÉS', '+ ADD WATER':'+ VÍZ HOZZÁADÁSA',
  'RECOVERY & MOBILITY':'REGENERÁCIÓ ÉS MOBILITÁS', 'Stretching':'Nyújtás', 'Build mobility, recover and move comfortably.':'Fejleszd a mobilitásod, regenerálódj és mozogj szabadon.',
  'Ready-made routines':'Előre összeállított rutinok', 'CHOOSE A ROUTINE':'VÁLASSZ RUTINT', 'muscle groups':'izomcsoport', 'START →':'INDÍTÁS →',
  'Build your own routine':'Saját rutin összeállítása', 'MULTIPLE SELECTION':'TÖBBES KIVÁLASZTÁS', 'Choose muscle groups':'Válassz izomcsoportokat',
  'CREATE MY STRETCHING ROUTINE →':'SAJÁT NYÚJTÓ RUTIN LÉTREHOZÁSA →', 'STRETCHING TIMER':'NYÚJTÁSIDŐZÍTŐ',
  'PAUSE TIMER':'IDŐZÍTŐ SZÜNETELTETÉSE', 'START TIMER':'IDŐZÍTŐ INDÍTÁSA', 'RESET':'VISSZAÁLLÍTÁS',
  'Switch sides if this movement uses both sides.':'Ha a gyakorlat kétoldali, válts oldalt.', 'Keep the movement gentle and controlled.':'Mozogj finoman és kontrolláltan.',
  'How to perform':'Végrehajtás', 'Breathing':'Légzés', 'Benefits':'Előnyök', 'Common mistakes':'Gyakori hibák',
  'Stretching history':'Nyújtási előzmények', 'COMPLETIONS':'TELJESÍTÉS', 'Your completed routines will appear here.':'Az elvégzett rutinjaid itt jelennek meg.',
  'Stretch gently. You should feel mild tension, not pain. Before workouts, use dynamic warm-ups rather than long static holds.':'Finoman nyújts: enyhe feszülést érezz, ne fájdalmat. Edzés előtt dinamikus bemelegítést végezz a hosszú statikus nyújtások helyett.',
  'YOUR JOURNEY':'A TE FEJLŐDÉSED', 'Progress':'Fejlődés', "See how far you've come.":'Nézd meg, mennyit fejlődtél.',
  'Workout activity':'Edzésaktivitás', 'LAST 7 DAYS':'UTOLSÓ 7 NAP', 'Weight progress':'Testsúly alakulása', 'LAST 7 RECORDS':'UTOLSÓ 7 RÖGZÍTÉS',
  'kg current profile weight':'kg – profil szerinti testsúly', 'SAVE CURRENT WEIGHT':'AKTUÁLIS SÚLY MENTÉSE', 'Your weight history will appear here.':'A testsúly-előzményeid itt jelennek meg.',
  'Strength tracking':'Erőnléti követés', 'EXERCISE RECORDS':'GYAKORLATNAPLÓ', 'Log your strength progress':'Rögzítsd az erőnléti fejlődésed',
  'Exercise name':'Gyakorlat neve', 'Weight (kg)':'Súly (kg)', 'Reps':'Ismétlés', 'Sets':'Sorozat', 'SAVE STRENGTH RECORD':'ERŐNLÉTI ADAT MENTÉSE',
  'Choose exercise to view':'Válassz gyakorlatot', 'No strength records for this exercise yet.':'Ehhez a gyakorlathoz még nincs rögzített adat.',
  'Stretching progress':'Nyújtási fejlődés', 'ROUTINES':'RUTIN', 'Completed stretching routines':'Teljesített nyújtó rutinok',
  'OPEN STRETCHING →':'NYÚJTÁS MEGNYITÁSA →', 'Training achievements':'Edzési eredmények', 'UNLOCKED':'FELOLDVA', 'LOCKED':'ZÁROLVA',
  'BIFIT AI EXPERIENCE':'BIFIT AI ÉLMÉNY', 'AI COACH':'AI EDZŐ', 'Coming Soon!':'Hamarosan!',
  "We're working on something great! Your AI Coach is currently training very hard. Thanks for your patience — we can't wait to show you what's coming! 💪":'Valami nagyszerűn dolgozunk! Az AI edzőnk jelenleg keményen készül. Köszönjük a türelmed — alig várjuk, hogy megmutassuk! 💪',
  '✦ UNDER DEVELOPMENT':'✦ FEJLESZTÉS ALATT', 'YOUR ACCOUNT':'FIÓKOD', 'Profile':'Profil',
  'Your fitness profile':'Fitneszprofilod', 'Your personal information and goals.':'Személyes adataid és céljaid.',
  'Complete your profile to personalize your experience.':'Töltsd ki a profilod a személyre szabott élményért.',
  'EDIT PROFILE':'PROFIL SZERKESZTÉSE', 'SET UP MY PROFILE':'PROFIL BEÁLLÍTÁSA', 'Goal':'Cél', 'Body type':'Testalkat', 'Age':'Életkor', 'Height':'Magasság', 'Weight':'Testsúly', 'Experience':'Edzettségi szint', 'Training days':'Edzésnapok', 'Equipment':'Felszerelés',
  'Your account level':'Fiókszinted', 'Settings':'Beállítások', 'APP':'ALKALMAZÁS', 'Version 2.2 · Your personal fitness platform.':'2.2 verzió · Személyes fitneszplatform.',
  'VIEW MY PROGRESS →':'FEJLŐDÉSEM MEGTEKINTÉSE →', 'OPEN AI COACH →':'AI EDZŐ MEGNYITÁSA →', 'RESET APP DATA':'ALKALMAZÁS ADATAINAK TÖRLÉSE',
  'HOME':'KEZDŐLAP', 'Home':'Kezdőlap', 'Workout':'Edzés', 'Nutrition':'Táplálkozás', 'Stretch':'Nyújtás', 'Calendar':'Naptár',
  'PERSONALIZATION':'SZEMÉLYRE SZABÁS', 'CLOSE ✕':'BEZÁRÁS ✕', 'STEP':'LÉPÉS', 'OF':'/',
  "What's your main goal?":'Mi a fő célod?', 'Your plan will be adapted to your goal.':'A terved a célodhoz igazodik.',
  'Your body type':'Testalkatod', 'Optional information for your profile.':'Opcionális információ a profilodhoz.',
  'About you':'Rólad', 'Enter your basic information.':'Add meg az alapadataidat.', 'Experience level':'Edzettségi szinted', 'Choose your current training experience.':'Válaszd ki a jelenlegi edzettségi szinted.',
  'Weekly schedule':'Heti beosztás', 'How many days can you train?':'Hány napot tudsz edzeni hetente?',
  'Training equipment':'Edzéshez használt felszerelés', 'Where do you usually train?':'Hol szoktál edzeni?',
  'Beginner':'Kezdő', 'Intermediate':'Középhaladó', 'Advanced':'Haladó', 'Gym':'Edzőterem',
  'Home with equipment':'Otthon, felszereléssel', 'Home without equipment':'Otthon, felszerelés nélkül',
  '2 days':'2 nap', '3 days':'3 nap', '4 days':'4 nap', '5 days':'5 nap', '6 days':'6 nap',
  'Slim':'Vékony', 'Average':'Átlagos', 'Athletic':'Sportos', 'Higher body fat':'Magasabb testzsír',
  'First step':'Első lépés', 'Getting started':'Kezdeti lendület', 'One week strong':'Egy erős hét', 'Dedicated':'Elkötelezett', 'Committed':'Kitartó', 'Consistency':'Következetesség', 'Unstoppable':'Megállíthatatlan',
  'Complete your first workout':'Teljesítsd az első edzésed', 'Complete 3 workouts':'Teljesíts 3 edzést', 'Complete 7 workouts':'Teljesíts 7 edzést', 'Complete 10 workouts':'Teljesíts 10 edzést', 'Complete 20 workouts':'Teljesíts 20 edzést', 'Reach a 3-day streak':'Érj el 3 napos sorozatot', 'Reach a 7-day streak':'Érj el 7 napos sorozatot',
  'Primary muscles':'Elsődleges izmok', 'Secondary muscles':'Másodlagos izmok', 'Muscles worked':'Megdolgoztatott izmok', 'Exercise overview':'Gyakorlat áttekintése', 'Exercise information':'Gyakorlat részletei', 'Expected results':'Várható előnyök', 'Rest time':'Pihenőidő', 'Home alternatives':'Otthoni alternatívák', 'Easier':'Könnyebb', 'Harder':'Nehezebb', 'BACK TO EXERCISES':'VISSZA A GYAKORLATOKHOZ', 'INFO':'INFÓ',

  'Glute bridge':'Farizomhíd', 'Cable glute kickback':'Csigás farizomrúgás', 'Hip abduction machine':'Comb-távolító gép',
  'Cable pull-through':'Csigás csípőfeszítés', 'Step-ups':'Fellépés padra', 'Sumo squat':'Szumó guggolás',
  'Seated leg curl':'Ülő lábhajlítás', 'Leg extension':'Lábnyújtás gépen', 'Frog pumps':'Békapumpa',
  'Side-lying hip abduction':'Oldalfekvéses lábemelés', 'Dead bug':'Dead bug – ellentétes kar-láb nyújtás',
  'Bird dog':'Madár-kutya gyakorlat', 'Reverse crunch':'Fordított hasprés', 'Back extension':'Hátfeszítés',
  'Single-leg Romanian deadlift':'Egylábas román felhúzás',
  'Full Body & Glutes A':'Teljes test és farizom A', 'Full Body & Glutes B':'Teljes test és farizom B',
  'Lower Body & Glutes':'Alsótest és farizom', 'Upper Body & Core':'Felsőtest és törzs',
  'Glutes, Legs & Full Body':'Farizom, láb és teljes test', 'Lower Body & Glutes A':'Alsótest és farizom A',
  'Upper Body A':'Felsőtest A', 'Lower Body & Glutes B':'Alsótest és farizom B',
  'Upper Body & Core B':'Felsőtest és törzs B', 'Glutes & Hamstrings':'Farizom és combhajlítók',
  'Quads & Glutes':'Combfeszítők és farizom', 'Upper Body B':'Felsőtest B', 'Glutes & Full Body':'Farizom és teljes test',
  'Glutes & Hamstrings A':'Farizom és combhajlítók A', 'Quads & Core':'Combfeszítők és törzs',
  'Glutes & Hamstrings B':'Farizom és combhajlítók B', 'Full Body & Core':'Teljes test és törzs'
};
Object.assign(HU, {
  'Workout Calendar':'Edzésnaptár','App language':'Alkalmazás nyelve','OPEN CALENDAR →':'NAPTÁR MEGNYITÁSA →','Training weekdays':'Edzésnapok a héten',
  'Monday':'Hétfő','Tuesday':'Kedd','Wednesday':'Szerda','Thursday':'Csütörtök','Friday':'Péntek','Saturday':'Szombat','Sunday':'Vasárnap',
  'Calves':'Vádli','Biceps':'Bicepsz','Triceps':'Tricepsz','Quadriceps':'Combfeszítő','Hamstrings':'Combhajlító','Forearms':'Alkar','Abs':'Hasizom','Full Body':'Teljes test',
  'Bench press':'Fekvenyomás','Incline dumbbell press':'Ferdepados kézisúlyzós nyomás','Push-ups':'Fekvőtámasz','Cable fly':'Csigás tárogatás',
  'Lat pulldown':'Felső csigás lehúzás','Seated cable row':'Ülő csigás evezés','Pull-ups':'Húzódzkodás','Dumbbell row':'Egykezes evezés',
  'Shoulder press':'Vállból nyomás','Lateral raises':'Oldalemelés','Bicep curls':'Bicepsz hajlítás','Hammer curls':'Kalapács bicepsz',
  'Tricep pushdown':'Tricepsz letolás','Tricep dips':'Tricepsz tolódzkodás','Squats':'Guggolás','Goblet squat':'Goblet guggolás',
  'Leg press':'Lábtoló','Romanian deadlift':'Román felhúzás','Lunges':'Kitörés','Plank':'Plank','Crunches':'Hasprés','Leg raises':'Lábemelés',
  'Mountain climbers':'Hegymászó gyakorlat','Jumping jacks':'Terpesz-zár szökdelés','Deadlift':'Felhúzás','Barbell squat':'Rudas guggolás',
  'Bulgarian split squat':'Bolgár guggolás','Chest dips':'Mellizom tolódzkodás','Face pulls':'Köteles archoz húzás','Arnold press':'Arnold-nyomás',
  'Preacher curls':'Scott-pados bicepsz','Skull crushers':'Fekvő tricepsznyújtás','Hip thrust':'Csípőemelés rúddal','Hanging knee raises':'Függeszkedéses térdemelés',
  'Burpees':'Burpee','Standing calf raises':'Álló vádliemelés',
  'Push Day':'Toló nap','Pull Day':'Húzó nap','Legs & Core':'Láb és törzs','Upper Body A':'Felsőtest A','Lower Body A':'Alsótest A',
  'Upper Body B':'Felsőtest B','Lower Body B':'Alsótest B','Legs Day':'Lábnap','Upper Body':'Felsőtest','Lower Body & Core':'Alsótest és törzs',
  'Push A':'Toló A','Pull A':'Húzó A','Legs A':'Láb A','Push B':'Toló B','Pull B':'Húzó B','Legs B':'Láb B',
  'Greek yogurt with berries':'Görög joghurt bogyós gyümölcsökkel','Banana and peanut butter':'Banán mogyoróvajjal','Oatmeal':'Zabkása',
  'Cottage cheese with fruit':'Túró gyümölccsel','Protein shake':'Fehérjeturmix','Rice cakes with peanut butter':'Rizsszelet mogyoróvajjal',
  'Mixed nuts':'Olajos magvak','Chicken and rice':'Csirke rizzsel','Eggs and wholegrain toast':'Tojás teljes kiőrlésű pirítóssal',
  'Salmon and potatoes':'Lazac burgonyával','Yogurt and banana':'Joghurt banánnal','Tuna sandwich':'Tonhalas szendvics',
  'Breakfast or snack':'Reggeli vagy nasi','30–60 minutes before training':'Edzés előtt 30–60 perccel','Breakfast or 1–2 hours before training':'Reggeli vagy edzés előtt 1–2 órával',
  'Afternoon snack':'Délutáni nasi','Convenient after training or between meals':'Edzés után vagy étkezések között','Before training or as a snack':'Edzés előtt vagy nasiként',
  'Between meals':'Étkezések között','After training or lunch':'Edzés után vagy ebédre','Breakfast or after training':'Reggelire vagy edzés után','Lunch or dinner':'Ebédre vagy vacsorára','Before or after training':'Edzés előtt vagy után',
  'A convenient source of carbohydrates and energy.':'Kényelmes szénhidrát- és energiaforrás.','Provides carbohydrates and some protein for a filling meal.':'Szénhidrátot és némi fehérjét biztosít, laktató étkezésként.','A protein-rich option with fruit for extra carbohydrates.':'Fehérjedús választás gyümölccsel és extra szénhidráttal.',
  'A quick way to add protein when it is useful.':'Gyors megoldás a fehérjebevitel kiegészítésére.','Easy to prepare and provides a mix of carbohydrates and fats.':'Könnyen elkészíthető, szénhidrátot és zsírt is tartalmaz.','A compact snack with healthy fats and some protein.':'Kis adagú nasi egészséges zsírokkal és némi fehérjével.',
  'Combines protein and carbohydrates in a balanced meal.':'Fehérjét és szénhidrátot kombinál kiegyensúlyozott étkezésben.','Provides protein, carbohydrates and several important nutrients.':'Fehérjét, szénhidrátot és több fontos tápanyagot biztosít.',
  'A filling meal with protein, carbohydrates and omega-3 fats.':'Laktató étkezés fehérjével, szénhidráttal és omega-3 zsírokkal.','An easy combination of protein and carbohydrates.':'Egyszerű fehérje- és szénhidrátforrás.','A practical protein-rich meal that is easy to prepare.':'Praktikus, könnyen elkészíthető, fehérjedús étkezés.',
  'Serving size / Recommended portion':'Adagméret / Ajánlott adag',
  'What can it support?':'Miben segíthet?',
  'Why is it useful?':'Miért hasznos?',
  'Key nutrients':'Fontos tápanyagok',
  'When can you eat it?':'Mikor fogyaszthatod?',
  'Things to know':'Amire érdemes figyelni',
  'Alternatives':'Alternatívák',
  'BIFIT SMART NUTRITION':'BIFIT OKOS TÁPLÁLKOZÁS',
  'VIEW FOOD INFORMATION':'ÉTELINFORMÁCIÓK MEGTEKINTÉSE',
  'FOOD INFO':'ÉTELINFÓ',
  'ADD TO DIARY':'NAPLÓHOZ ADÁS',
  '+ ADD THIS FOOD TO DIARY':'+ ÉTEL HOZZÁADÁSA A NAPLÓHOZ',
  '2 large eggs + 2 slices wholegrain toast':'2 nagy tojás + 2 szelet teljes kiőrlésű pirítós',
  '150 g cooked chicken breast + 200 g cooked rice':'150 g sült/főtt csirkemell + 200 g főtt rizs',
  '200 g plain Greek yogurt':'200 g natúr görög joghurt',
  '50 g oats + 200 ml milk or fortified alternative':'50 g zab + 200 ml tej vagy dúsított növényi ital',
  '30 g protein powder mixed with water; follow the product label':'30 g fehérjepor vízzel elkeverve; kövesd a termék címkéjét',
  '120–150 g cooked salmon + 200 g potatoes':'120–150 g sült lazac + 200 g burgonya',
  '200 g Greek yogurt + 80 g berries':'200 g görög joghurt + 80 g bogyós gyümölcs',
  '1 medium banana + 15 g peanut butter':'1 közepes banán + 15 g mogyoróvaj',
  '150 g cottage cheese + 1 small apple':'150 g túró + 1 kisebb alma',
  '2 rice cakes + 15 g peanut butter':'2 puffasztott rizsszelet + 15 g mogyoróvaj',
  '25–30 g unsalted mixed nuts (a small handful)':'25–30 g sótlan vegyes olajos mag (egy kis marék)',
  '2 eggs + 2 slices wholegrain bread':'2 tojás + 2 szelet teljes kiőrlésű kenyér',
  '170–200 g plain yogurt + 1 medium banana':'170–200 g natúr joghurt + 1 közepes banán',
  '1 wholegrain sandwich with about 80 g drained tuna':'1 teljes kiőrlésű szendvics kb. 80 g lecsepegtetett tonhallal',
  'A balanced breakfast with protein, fats and carbohydrates.':'Kiegyensúlyozott reggeli fehérjével, zsírokkal és szénhidrátokkal.',
  'Eggs provide complete protein, choline and vitamin B12. Wholegrain toast adds carbohydrates and fibre.':'A tojás teljes értékű fehérjét, kolint és B12-vitamint biztosít. A teljes kiőrlésű pirítós szénhidrátot és rostot ad.',
  'Choline, vitamin B12, selenium and fibre (amounts vary by bread and preparation).':'Kolin, B12-vitamin, szelén és rost (a mennyiség a kenyértől és elkészítéstől függ).',
  'Breakfast, or a meal 1–3 hours before training.':'Reggelire vagy edzés előtt 1–3 órával.',
  'Allergens: egg and usually wheat/gluten. Nutrition changes with butter, oil and toppings.':'Allergének: tojás, illetve általában búza/glutén. A vaj, olaj és feltétek módosítják a tápértéket.',
  'Use wholegrain wraps instead of toast, or tofu scramble instead of eggs.':'Pirítós helyett használhatsz teljes kiőrlésű tortillát, tojás helyett pedig tofu rántottát.',
  'A protein-and-carbohydrate meal that fits many training goals.':'Fehérjét és szénhidrátot tartalmazó étkezés, amely sokféle edzéscélba beilleszthető.',
  'Chicken supplies high-quality protein; rice supplies carbohydrates that help replenish muscle glycogen.':'A csirke jó minőségű fehérjét ad; a rizs szénhidrátot biztosít az izmok glikogénraktárainak feltöltéséhez.',
  'Protein, niacin (B3), vitamin B6, selenium and carbohydrates.':'Fehérje, niacin (B3-vitamin), B6-vitamin, szelén és szénhidrát.',
  'Lunch or after training; portion size can be adjusted to appetite and daily needs.':'Ebédre vagy edzés után; az adag az étvágyhoz és a napi szükséglethez igazítható.',
  'Cook chicken thoroughly and refrigerate leftovers promptly. Add vegetables for fibre and variety.':'A csirkét süsd/főzd át alaposan, a maradékot gyorsan tedd hűtőbe. A rost és változatosság érdekében adj hozzá zöldséget.',
  'Try turkey, tofu or beans for protein; potatoes, pasta or quinoa instead of rice.':'Fehérjeforrásként próbáld ki a pulykát, tofut vagy babot; rizs helyett burgonyát, tésztát vagy quinoát.',
  'An easy protein-rich snack or breakfast base.':'Egyszerű, fehérjedús nasi vagy reggeli alap.',
  'Provides protein and calcium; choose plain yogurt to control added sugar.':'Fehérjét és kalciumot biztosít; a hozzáadott cukor szabályozásához válassz natúr joghurtot.',
  'Calcium, vitamin B12 and often live cultures, depending on product.':'Kalcium, B12-vitamin és terméktől függően élő kultúrák.',
  'Breakfast, snack or after training as part of a meal.':'Reggelire, nasiként vagy edzés után egy étkezés részeként.',
  'Contains milk. Protein and calories vary considerably between brands and fat levels.':'Tejet tartalmaz. A fehérje- és kalóriatartalom márkánként és zsírtartalom szerint jelentősen eltérhet.',
  'Use lactose-free Greek yogurt or a fortified soy yogurt with comparable protein.':'Használj laktózmentes görög joghurtot vagy hasonló fehérjetartalmú, dúsított szójajoghurtot.',
  'A flexible carbohydrate-rich breakfast that can be made more protein-rich.':'Rugalmas, szénhidrátban gazdag reggeli, amely fehérjével is kiegészíthető.',
  'Oats provide slow-digesting carbohydrates and beta-glucan fibre; milk adds protein and calcium.':'A zab lassabban emészthető szénhidrátot és béta-glükán rostot ad; a tej fehérjét és kalciumot biztosít.',
  'Beta-glucan fibre, manganese, magnesium, iron and (with milk) calcium.':'Béta-glükán rost, mangán, magnézium, vas és (tejjel készítve) kalcium.',
  'Breakfast or around 1–2 hours before training if it feels comfortable.':'Reggelire vagy edzés előtt körülbelül 1–2 órával, ha jól esik.',
  'Oats contain fibre, which may feel heavy immediately before exercise. Check cross-contamination if avoiding gluten.':'A zab rosttartalma közvetlenül edzés előtt nehéznek érződhet. Gluténkerülés esetén figyelj a keresztszennyeződésre.',
  'Make with soy milk, add yogurt, or use rice porridge for a lower-fibre option.':'Készítsd szójaitallal, adj hozzá joghurtot, vagy válassz alacsonyabb rosttartalmú rizskását.',
  'A convenient way to top up protein when regular food is not practical.':'Kényelmes módja a fehérjebevitel kiegészítésének, ha a hagyományos étel nem praktikus.',
  'Supplies protein for muscle repair and growth when combined with appropriate training and total daily intake.':'Fehérjét biztosít az izmok regenerációjához és növekedéséhez, megfelelő edzéssel és napi bevitellel együtt.',
  'Protein; micronutrients depend on the powder formulation.':'Fehérje; a mikrotápanyagok a por összetételétől függenek.',
  'Whenever convenient, including after training; there is no narrow post-workout deadline.':'Bármikor, amikor kényelmes, akár edzés után is; nincs szűk időablak az edzés utáni fogyasztásra.',
  'Not essential if protein needs are met through food. Check milk/soy allergens, sweeteners and serving size.':'Nem szükséges, ha ételből fedezed a fehérjeszükségletedet. Ellenőrizd a tej-/szójaallergéneket, édesítőket és az adagot.',
  'Greek yogurt, cottage cheese, milk or a protein-rich soy drink.':'Görög joghurt, túró, tej vagy fehérjedús szójaital.',
  'A substantial meal with protein, carbohydrates and unsaturated fats.':'Tartalmas étkezés fehérjével, szénhidrátokkal és telítetlen zsírokkal.',
  'Salmon provides high-quality protein and omega-3 fats; potatoes provide carbohydrates and potassium.':'A lazac jó minőségű fehérjét és omega-3 zsírokat ad; a burgonya szénhidrátot és káliumot biztosít.',
  'Omega-3 EPA/DHA, vitamin D, vitamin B12, selenium and potassium.':'Omega-3 EPA/DHA, D-vitamin, B12-vitamin, szelén és kálium.',
  'Lunch or dinner, including on training days.':'Ebédre vagy vacsorára, edzésnapokon is.',
  'Contains fish. Choose varied protein sources across the week; preparation and added oil affect calories.':'Halat tartalmaz. A hét során válassz változatos fehérjeforrásokat; az elkészítés és a hozzáadott olaj módosítja a kalóriát.',
  'Use trout or sardines instead of salmon, and rice or sweet potato instead of potatoes.':'Lazac helyett használhatsz pisztrángot vagy szardíniát, burgonya helyett rizst vagy édesburgonyát.',
  'Food does not cause bulking or cutting by itself; your overall intake and activity matter.':'Önmagában egy étel nem okoz tömegelést vagy szálkásítást; a teljes napi bevitel és aktivitás számít.',
  'FOOD INFO':'ÉTELINFÓ','VIEW FOOD INFORMATION':'ÉTELINFORMÁCIÓK MEGTEKINTÉSE','ADD TO DIARY':'NAPLÓHOZ ADÁS',
  'Serving size / Recommended portion':'Adagméret / Ajánlott adag','What can it support?':'Miben segíthet?','Muscle building':'Izomépítés','Recovery':'Regeneráció','Training energy':'Edzésenergia','Everyday energy':'Mindennapi energia','Satiety':'Jóllakottság','Weight gain support':'Tömegnövelés támogatása','Convenient snack':'Praktikus nasi','Everyday health':'Mindennapi egészség','Convenient meal':'Praktikus étkezés','Why is it useful?':'Miért hasznos?','Key nutrients':'Fontos tápanyagok','When can you eat it?':'Mikor fogyaszthatod?','Things to know':'Amire érdemes figyelni','Alternatives':'Alternatívák','BIFIT SMART NUTRITION':'BIFIT OKOS TÁPLÁLKOZÁS','Protein':'Fehérje','Carbs':'Szénhidrát','Fat':'Zsír','kcal':'kcal',
  'Nutrition values are estimates for the stated example portion. Brands, recipes and cooking methods change the numbers. Food does not cause bulking or cutting by itself; your overall intake and activity matter. For custom entries, information is not verified.':'A tápértékek a megadott példaadagra vonatkozó becslések. A márka, a recept és az elkészítés módja módosítja az értékeket. Önmagában egy étel nem okoz tömegelést vagy szálkásítást; a teljes napi bevitel és aktivitás számít. Az egyéni bejegyzések adatai nincsenek ellenőrizve.',
  '+ ADD THIS FOOD TO DIARY':'+ ÉTEL HOZZÁADÁSA A NAPLÓHOZ',
  'Food database search':'Ételadatbázis kereső','GLOBAL FOOD SEARCH':'NAGY ÉTELADATBÁZIS','SEARCH FOODS →':'ÉTELEK KERESÉSE →','SEARCHING...':'KERESÉS...','ADD TO DIARY':'NAPLÓHOZ ADÁS','SAVE FOOD':'ÉTEL MENTÉSE','My saved foods':'Mentett ételeim',
  'Sound Effects':'Hanghatások','Sound effects':'Hanghatások','TEST SOUND':'HANG TESZTELÉSE','Allow sound effects where supported.':'Hanghatások engedélyezése, ha támogatottak.','Play short sounds for button presses and key events.':'Rövid hangjelzések gombnyomáskor és fontos eseményeknél.','Text size':'Szövegméret','High contrast':'Erősebb kontraszt','Reduce animations':'Animációk csökkentése','Small':'Kicsi','Normal':'Normál','Large':'Nagy',
  'Gym':'Edzőterem','Home equipment':'Otthoni felszerelés','No equipment':'Eszköz nélkül','Home with equipment':'Otthon, felszereléssel','Home without equipment':'Otthon, felszerelés nélkül',
  'Check your age':'Ellenőrizd az életkorod','Enter an age between 13 and 100.':'13 és 100 év közötti életkort adj meg.','Check your height':'Ellenőrizd a magasságod','Enter a height between 100 and 250 cm.':'100 és 250 cm közötti magasságot adj meg.',
  'Check your weight':'Ellenőrizd a testsúlyod','Enter a valid weight.':'Adj meg érvényes testsúlyt.','Choose your training days':'Válaszd ki az edzésnapjaidat','Please select exactly':'Pontosan ennyi napot válassz ki:',
  'Profile created! 🎉':'Profil létrehozva! 🎉','You earned 50 XP.':'50 XP-t szereztél.','No exercises completed':'Nincs teljesített gyakorlat','Mark at least one exercise before finishing.':'A befejezés előtt jelölj meg legalább egy gyakorlatot.',
  'Already completed':'Már teljesítetted','You have already recorded a workout today.':'Mára már rögzítettél egy edzést.','Workout completed! 🏆':'Edzés teljesítve! 🏆','You earned XP. Keep up the great work!':'XP-t szereztél. Csak így tovább!',
  'Meal added':'Étel hozzáadva','Your food diary has been updated. +5 XP':'Az étkezési naplód frissült. +5 XP','Missing information':'Hiányzó adatok','Enter a food name and calorie amount.':'Add meg az étel nevét és kalóriatartalmát.',
  'Invalid weight':'Érvénytelen testsúly','Update your weight in your profile first.':'Először frissítsd a testsúlyodat a profilodban.','Weight saved':'Testsúly elmentve','Your progress has been updated. +10 XP':'A fejlődésed frissült. +10 XP',
  'Check your entry':'Ellenőrizd a megadott adatokat','Enter an exercise, weight, reps and sets.':'Add meg a gyakorlatot, a súlyt, az ismétléseket és a sorozatokat.','Strength record saved':'Erőnléti adat elmentve','Your strength progress has been updated. +10 XP':'Az erőnléti fejlődésed frissült. +10 XP',
  'Choose a muscle group':'Válassz izomcsoportot','Select at least one group first.':'Először válassz ki legalább egy izomcsoportot.','Stretching completed! 🧘':'Nyújtás teljesítve! 🧘','Great work. You earned 20 XP.':'Szép munka! 20 XP-t szereztél.'
});


Object.assign(HU, {
  'Choose your training weekdays':'Válaszd ki az edzésnapjaidat',
  'View your monthly schedule and completed sessions.':'Tekintsd meg a havi beosztásodat és az elvégzett edzéseidet.',
  'Loading your fitness platform...':'A fitneszplatform betöltése...',
  'Daily calorie progress':'Napi kalóriacél teljesítése',
  'ⓘ INFO':'ⓘ INFÓ', 'ⓘ WHY THIS MATTERS':'ⓘ MIÉRT FONTOS?', 'ⓘ WHY IT MATTERS':'ⓘ MIÉRT FONTOS?',
  'Your remaining targets':'Hátralévő napi céljaid',
  'Suggestions are flexible ideas, not strict meal timing rules.':'Az ajánlások rugalmas ötletek, nem kötelező étkezési szabályok.',
  'ⓘ FOOD INFO':'ⓘ ÉTELINFÓ', 'ⓘ VIEW FOOD INFORMATION':'ⓘ ÉTELINFORMÁCIÓK',
  '+ ADD TO DIARY':'+ HOZZÁADÁS A NAPLÓHOZ', '+ ADD':'+ HOZZÁADÁS',
  'Daily water intake':'Napi vízbevitel', 'Why drinking enough matters':'Miért fontos elegendő vizet inni?',
  'A profile-based starting estimate':'A profilod alapján becsült kiinduló érték',
  'Your current daily target':'Jelenlegi napi célod', 'Why protein matters':'Miért fontos a fehérje?',
  'How to use your target':'Hogyan használd a célértékedet?',
  'More is not automatically better. Individual needs vary with age, health, training and total diet.':'A több nem feltétlenül jobb. Az egyéni szükséglet az életkortól, egészségi állapottól, edzéstől és a teljes étrendtől is függ.',
  'Why carbohydrates matter':'Miért fontosak a szénhidrátok?', 'Useful food sources':'Hasznos élelmiszer-források',
  'Why dietary fats matter':'Miért fontosak az étrendi zsírok?',
  'Do not eliminate dietary fat. The type and overall amount both matter.':'Ne hagyd ki teljesen a zsírokat az étrendedből. A zsír típusa és teljes mennyisége egyaránt számít.',
  'Why calories matter':'Miért fontos a kalóriabevitel?', 'How your estimate is calculated':'Hogyan számítjuk ki a becsült értéket?',
  'Do not treat this estimate as a medical prescription or a strict daily pass/fail score.':'Ezt a becslést ne tekintsd orvosi előírásnak vagy szigorú napi megfelelési mércének.',
  'Your current daily target':'Jelenlegi napi célod', 'Your remaining targets':'Hátralévő napi céljaid',
  'View food information':'Ételinformációk megtekintése', 'Food information':'Ételinformációk',
  'Exercise overview':'Gyakorlat áttekintése', 'Sets':'Sorozatok', 'Reps':'Ismétlések', 'Equipment':'Felszerelés',
  'Trainer tips':'Edzői tippek', 'Variations':'Variációk', 'BIFIT · TRAINING OVERVIEW':'BIFIT · EDZÉS ÁTTEKINTÉS',
  'Number of workouts':'Edzések száma', 'Workout completed':'Edzés teljesítve', 'Workout details':'Edzés részletei',
  'No workout is scheduled for this day. Recovery matters!':'Erre a napra nincs edzés beütemezve. A regeneráció is fontos!',
  'Recorded workout':'Rögzített edzés', 'movements':'gyakorlat', 'workouts remaining':'hátralévő edzés',
  'Profile':'Profil', 'App language':'Alkalmazás nyelve', 'English':'Angol', 'Hungarian':'Magyar',
  'PREV':'ELŐZŐ', 'NEXT':'KÖVETKEZŐ', 'COMPLETED':'TELJESÍTVE', 'SCHEDULED':'TERVEZETT', 'MISSED':'KIHAGYOTT',
  'Workout Calendar':'Edzésnaptár', 'Selected day':'Kiválasztott nap', 'Weekly overview':'Heti áttekintés',
  'Workouts completed this week':'Ezen a héten teljesített edzések', 'Rest day':'Pihenőnap',
  'Daily hydration':'Napi folyadékbevitel', 'Water intake':'Vízbevitel', 'ADD GLASS':'POHÁR HOZZÁADÁSA',
  'Daily calories':'Napi kalória', 'Calories remaining':'Hátralévő kalória', 'kcal remaining':'kcal hátra',
  'No meals added yet.':'Még nincs rögzített étkezés.', 'Your completed routines will appear here.':'Az elvégzett rutinjaid itt jelennek meg.',
  'Your weight history will appear here.':'A testsúly-előzményeid itt jelennek meg.',
  'No strength records for this exercise yet.':'Ehhez a gyakorlathoz még nincs rögzített erőnléti adat.',
  'Choose exercise to view':'Válassz gyakorlatot a megtekintéshez', 'Log your strength progress':'Rögzítsd az erőnléti fejlődésedet',
  'Your fitness profile':'Fitneszprofilod', 'Your personal information and goals.':'Személyes adataid és céljaid.',
  'Version 2.2 · Your personal fitness platform.':'2.2 verzió · Személyes fitneszplatform.',
  'Build mobility, recover and move comfortably.':'Fejleszd a mobilitásod, regenerálódj és mozogj kényelmesen.',
  'Track your food and understand your daily intake.':'Kövesd az étkezéseidet és ismerd meg a napi tápanyagbeviteledet.',
  'Build strength. Track progress. Improve every day.':'Építs erőt. Kövesd a fejlődésed. Fejlődj minden nap.',
  'See how far you\'ve come.':'Nézd meg, mennyit fejlődtél.',
  'Small steps. Consistent progress.':'Apró lépések. Folyamatos fejlődés.',
  'An intelligent AI assistant is coming soon to BIFIT.':'Hamarosan intelligens AI-asszisztens érkezik a BIFIT-be.',
  'Your AI Coach is currently training very hard.':'Az AI-edződ jelenleg keményen készül.',
  'CLOSE':'BEZÁRÁS', 'SAVE':'MENTÉS', 'CANCEL':'MÉGSE', 'DELETE':'TÖRLÉS', 'BACK':'VISSZA',
  'Search exercises...':'Gyakorlatok keresése...', 'Search quick meals...':'Gyors ételek keresése...',
  'Food name':'Étel neve', 'Calories':'Kalória', 'Protein':'Fehérje', 'Carbs':'Szénhidrát', 'Fat':'Zsír',
  'Water goal':'Vízbevitel cél', 'Calorie goal':'Kalóriacél', 'Protein goal':'Fehérjecél', 'Carbs goal':'Szénhidrátcél', 'Fat goal':'Zsírcél',
  'Choose your fitness profile':'Válaszd ki a fitneszprofilodat', 'Choose the profile that best matches you.':'Válaszd ki a hozzád illő profilt.',
  "Men's Fitness":'Férfi fitnesz', "Women's Fitness":'Női fitnesz', 'Male profile':'Férfi profil', 'Female profile':'Női profil',
  'Your profile':'Profilod', 'Selected':'Kiválasztva', 'Change profile':'Profil módosítása',
  'Female calorie estimate uses the female Mifflin–St Jeor equation.':'A női kalóriabecslés a női Mifflin–St Jeor-képletet használja.',
  'Male calorie estimate uses the male Mifflin–St Jeor equation.':'A férfi kalóriabecslés a férfi Mifflin–St Jeor-képletet használja.'
});

const translateString = (value, language) => {
  if (language !== 'hu' || typeof value !== 'string') return value;
  if (HU[value]) return HU[value];
  let result = value;
  Object.keys(HU).sort((a,b) => b.length-a.length).forEach(key => {
    if (key.length > 2 && result.includes(key)) result = result.split(key).join(HU[key]);
  });
  return result;
};
function Text({ children, style, ...props }) {
  const language = React.useContext(LanguageContext);
  const accessibility = React.useContext(AccessibilityContext);
  const translated = React.Children.map(children, child =>
    typeof child === 'string' ? translateString(child, language) : child
  );
  const baseStyle = StyleSheet.flatten(style) || {};
  const scale = accessibility.textSize === 'large' ? 1.18 : accessibility.textSize === 'small' ? 0.9 : 1;
  const scaledStyle = scale === 1 ? style : [style, {
    ...(baseStyle.fontSize ? { fontSize: Math.round(baseStyle.fontSize * scale) } : {}),
    ...(baseStyle.lineHeight ? { lineHeight: Math.round(baseStyle.lineHeight * scale) } : {})
  }];
  return <RNText {...props} style={scaledStyle}>{translated}</RNText>;
}


const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const dateKey = d =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const formatDate = (key, locale = 'en-US') => {
  if (!key) return '';
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric'
  });
};

const defaultAnswers = {
  goal: 'Build muscle',
  bodyType: 'Slim',
  age: '',
  height: '',
  weight: '',
  experience: 'Beginner',
  days: '3 days',
  equipment: 'Gym'
};

const makeExercise = (
  id, name, muscle, level, equipment, reps, emoji, instructions,
  steps, homeAlternative, easier, harder, results
) => ({
  id: String(id),
  name,
  muscle,
  primaryMuscles: [muscle],
  secondaryMuscles: [],
  muscleTags: [muscle.toLowerCase()],
  level,
  equipment,
  sets: 3,
  reps,
  emoji,
  instructions,
  steps: steps || [
    'Set up in a stable and comfortable position.',
    'Brace your core and keep your movements controlled.',
    'Perform the movement through a comfortable range of motion.',
    'Return slowly to the starting position.'
  ],
  results: results || `Regular practice can help improve ${muscle.toLowerCase()} strength, control and muscular endurance.`,
  equipmentNeeded: equipment,
  rest: level === 'Advanced' ? '90–150 seconds' : '60–90 seconds',
  mistakes: [
    'Using momentum instead of controlled movement.',
    'Using too much weight or rushing repetitions.',
    'Losing a stable body position.',
    'Ignoring discomfort or pain.'
  ],
  tips: [
    'Prioritize good technique over heavier weights.',
    'Breathe naturally and avoid holding your breath.',
    'Increase difficulty gradually as your technique improves.'
  ],
  homeAlternative: homeAlternative || 'Use a controlled bodyweight variation if you do not have gym equipment.',
  easier: easier || 'Reduce the resistance or use a shorter range of motion.',
  harder: harder || 'Increase resistance gradually while keeping good technique.'
});

const exercises = [
  makeExercise(1, 'Bench press', 'Chest', 'Intermediate', 'Gym', '8–12', '🏋️',
    'Lower the bar with control and press it upward while keeping your feet planted.',
    ['Lie on the bench with your eyes under the bar.', 'Place your feet firmly on the floor.', 'Grip the bar slightly wider than shoulder width.', 'Lower the bar toward your mid-chest with control.', 'Press upward without bouncing the bar.'],
    'Push-ups or floor press with dumbbells.', 'Push-ups from your knees.', 'Use a gradual increase in bar weight.'),

  makeExercise(2, 'Incline dumbbell press', 'Chest', 'Intermediate', 'Gym', '8–12', '💪',
    'Use a slight bench incline and lower the dumbbells slowly.',
    ['Set the bench to a low incline.', 'Hold dumbbells above your upper chest.', 'Lower them slowly toward your chest.', 'Press upward while keeping your wrists stable.'],
    'Incline push-ups.', 'Use lighter dumbbells.', 'Increase weight or repetitions gradually.'),

  makeExercise(3, 'Push-ups', 'Chest', 'Beginner', 'No equipment', '8–15', '🤸',
    'Keep your body straight and lower your chest toward the floor.',
    ['Place your hands slightly wider than shoulder width.', 'Extend your legs and brace your core.', 'Lower your chest under control.', 'Push the floor away until your arms are extended.'],
    'Wall push-ups or incline push-ups.', 'Wall push-ups or knee push-ups.', 'Try decline push-ups or slower repetitions.'),

  makeExercise(4, 'Cable fly', 'Chest', 'Intermediate', 'Gym', '12–15', '🏋️',
    'Bring your arms together in a controlled arc and squeeze your chest.',
    ['Set the cable handles around chest height.', 'Stand in a stable split stance.', 'Keep a slight bend in your elbows.', 'Bring your hands together in front of your chest.', 'Return slowly without letting the weights pull you.'],
    'Dumbbell fly with light weights.', 'Use lighter resistance.', 'Increase resistance while maintaining control.'),

  makeExercise(5, 'Lat pulldown', 'Back', 'Beginner', 'Gym', '10–12', '💪',
    'Pull the bar toward your upper chest without swinging your torso.',
    ['Sit down and secure your thighs.', 'Grip the bar slightly wider than shoulder width.', 'Pull your elbows down toward your sides.', 'Bring the bar toward your upper chest.', 'Return slowly until your arms are extended.'],
    'Resistance-band pulldowns.', 'Use a lighter weight.', 'Increase resistance gradually.'),

  makeExercise(6, 'Seated cable row', 'Back', 'Beginner', 'Gym', '10–12', '🏋️',
    'Pull toward your waist and squeeze your shoulder blades together.',
    ['Sit upright with your feet against the platform.', 'Hold the handle with your arms extended.', 'Pull toward your waist.', 'Squeeze your shoulder blades together.', 'Return slowly without rounding your back.'],
    'Resistance-band rows.', 'Use lighter resistance.', 'Pause briefly at the end of each repetition.'),

  makeExercise(7, 'Pull-ups', 'Back', 'Advanced', 'Home equipment', '6–10', '🔥',
    'Start from a controlled hang and pull your body upward.',
    ['Grip the bar securely.', 'Start from a controlled hang.', 'Brace your core and pull your elbows down.', 'Bring your chin toward bar height.', 'Lower yourself slowly.'],
    'Resistance-band assisted pull-ups or inverted rows.', 'Use an assistance band.', 'Try weighted pull-ups.'),

  makeExercise(8, 'Dumbbell row', 'Back', 'Beginner', 'Gym', '10–12', '💪',
    'Keep your back neutral and pull the dumbbell toward your hip.',
    ['Support one hand on a bench.', 'Keep your back neutral.', 'Let the dumbbell hang below your shoulder.', 'Pull it toward your hip.', 'Lower it slowly.'],
    'Backpack rows or resistance-band rows.', 'Use a lighter dumbbell.', 'Increase weight gradually.'),

  makeExercise(9, 'Shoulder press', 'Shoulders', 'Advanced', 'Gym', '8–12', '🏋️',
    'Brace your core and press the weights overhead without arching your back.',
    ['Sit or stand with dumbbells at shoulder height.', 'Brace your abdomen.', 'Press the weights overhead.', 'Avoid shrugging excessively.', 'Lower the weights slowly.'],
    'Pike push-ups or resistance-band presses.', 'Use lighter weights.', 'Use a standing variation with more resistance.'),

  makeExercise(10, 'Lateral raises', 'Shoulders', 'Intermediate', 'Gym', '12–15', '💪',
    'Raise the weights out to your sides with a slight bend in your elbows.',
    ['Stand tall with dumbbells at your sides.', 'Keep a slight bend in your elbows.', 'Raise your arms outward.', 'Stop around shoulder height.', 'Lower slowly.'],
    'Use water bottles or light resistance bands.', 'Use lighter weights.', 'Add a controlled pause at the top.'),

  makeExercise(11, 'Bicep curls', 'Arms', 'Beginner', 'Gym', '10–12', '💪',
    'Keep your elbows close to your body and avoid swinging.',
    ['Stand with dumbbells by your sides.', 'Keep your elbows close to your torso.', 'Curl the weights upward.', 'Squeeze your biceps gently.', 'Lower slowly.'],
    'Resistance-band curls or backpack curls.', 'Use lighter weights.', 'Try slower repetitions.'),

  makeExercise(12, 'Hammer curls', 'Arms', 'Intermediate', 'Gym', '10–12', '🏋️',
    'Keep your palms facing each other throughout the curl.',
    ['Hold dumbbells with palms facing inward.', 'Keep your elbows near your torso.', 'Curl the weights upward.', 'Lower under control.'],
    'Resistance-band hammer curls.', 'Use lighter resistance.', 'Increase weight gradually.'),

  makeExercise(13, 'Tricep pushdown', 'Arms', 'Beginner', 'Gym', '10–15', '💪',
    'Keep your elbows tucked in and extend your arms downward.',
    ['Stand facing the cable machine.', 'Hold the attachment with elbows bent.', 'Keep your upper arms close to your body.', 'Push the handle downward.', 'Return slowly.'],
    'Resistance-band tricep extensions.', 'Use a lighter weight.', 'Use a rope attachment and controlled pauses.'),

  makeExercise(14, 'Tricep dips', 'Arms', 'Intermediate', 'Home equipment', '8–12', '🔥',
    'Lower yourself carefully and avoid forcing your shoulders into an uncomfortable position.',
    ['Place your hands on stable parallel supports.', 'Keep your shoulders controlled.', 'Bend your elbows slowly.', 'Lower only as far as comfortable.', 'Press back up.'],
    'Close-grip wall or incline push-ups.', 'Use assisted dips.', 'Add resistance only after mastering the movement.'),

  makeExercise(15, 'Squats', 'Legs', 'Beginner', 'No equipment', '12–15', '🦵',
    'Keep your feet stable, chest upright and knees tracking in line with your toes.',
    ['Stand with feet around shoulder width.', 'Brace your core.', 'Push your hips back and bend your knees.', 'Lower to a comfortable depth.', 'Push through your feet to stand.'],
    'Use a chair for supported squats.', 'Use a chair or reduce depth.', 'Try slower repetitions or pause squats.'),

  makeExercise(16, 'Goblet squat', 'Legs', 'Intermediate', 'Gym', '10–12', '🏋️',
    'Hold a dumbbell at chest height and squat with a stable torso.',
    ['Hold one dumbbell close to your chest.', 'Stand with feet around shoulder width.', 'Bend your knees and hips.', 'Keep your chest upright.', 'Push through your feet to stand.'],
    'Bodyweight squats.', 'Use a lighter dumbbell.', 'Increase resistance gradually.'),

  makeExercise(17, 'Leg press', 'Legs', 'Intermediate', 'Gym', '10–12', '💪',
    'Lower the platform under control and avoid locking your knees forcefully.',
    ['Sit with your back supported.', 'Place feet comfortably on the platform.', 'Release the safety handles.', 'Lower the platform slowly.', 'Press upward without forcefully locking your knees.'],
    'Bodyweight squats or step-ups.', 'Use a lighter load.', 'Increase resistance gradually.'),

  makeExercise(18, 'Romanian deadlift', 'Legs', 'Advanced', 'Gym', '8–12', '🏋️',
    'Push your hips backward and keep your spine neutral.',
    ['Stand with the weight in front of your thighs.', 'Keep your knees slightly bent.', 'Push your hips backward.', 'Lower the weight along your legs.', 'Drive your hips forward to return upright.'],
    'Hip hinges with a backpack or bodyweight.', 'Practice the hip hinge without weights.', 'Increase weight gradually.'),

  makeExercise(19, 'Lunges', 'Legs', 'Intermediate', 'No equipment', '10 each leg', '🦵',
    'Take a stable step and lower your back knee toward the floor.',
    ['Stand tall with feet hip-width apart.', 'Step forward with one leg.', 'Bend both knees under control.', 'Keep your front foot stable.', 'Push back to the starting position.'],
    'Supported split squats.', 'Hold a stable support.', 'Use dumbbells when technique is solid.'),

  makeExercise(20, 'Plank', 'Core', 'Beginner', 'No equipment', '30–45 sec', '🔥',
    'Keep your body straight and brace your core.',
    ['Place your forearms on the floor.', 'Extend your legs behind you.', 'Keep your head, hips and heels aligned.', 'Brace your abdomen.', 'Breathe steadily while holding the position.'],
    'Knee plank.', 'Hold from your knees.', 'Try longer holds or shoulder taps.'),

  makeExercise(21, 'Crunches', 'Core', 'Beginner', 'No equipment', '15–20', '🤸',
    'Lift your shoulders gently without pulling on your neck.',
    ['Lie on your back with knees bent.', 'Place your hands lightly beside your head.', 'Brace your abdomen.', 'Lift your shoulders slightly.', 'Lower slowly.'],
    'Short-range abdominal crunches.', 'Use a smaller range of motion.', 'Try slow controlled repetitions.'),

  makeExercise(22, 'Leg raises', 'Core', 'Intermediate', 'No equipment', '10–15', '🔥',
    'Control your lower back as you raise and lower your legs.',
    ['Lie on your back with legs extended.', 'Place your hands beside your body.', 'Brace your abdomen.', 'Raise your legs under control.', 'Lower slowly without arching your lower back.'],
    'Bent-knee raises.', 'Bend your knees.', 'Try slower repetitions.'),

  makeExercise(23, 'Mountain climbers', 'Cardio', 'Intermediate', 'No equipment', '30 sec', '🏃',
    'Alternate your knees forward while holding a strong plank position.',
    ['Start in a high plank.', 'Keep your shoulders above your hands.', 'Bring one knee toward your chest.', 'Switch legs smoothly.', 'Keep your hips stable.'],
    'Slow mountain climbers.', 'Move one leg at a time slowly.', 'Increase speed while keeping control.'),

  makeExercise(24, 'Jumping jacks', 'Cardio', 'Beginner', 'No equipment', '30 sec', '🏃',
    'Jump your feet apart while raising your arms overhead.',
    ['Stand upright with arms by your sides.', 'Jump your feet apart.', 'Raise your arms overhead.', 'Jump back to the starting position.', 'Repeat at a comfortable pace.'],
    'Step jacks without jumping.', 'Use step jacks.', 'Increase duration gradually.'),

  makeExercise(25, 'Deadlift', 'Back', 'Advanced', 'Gym', '5–8', '🏋️',
    'Lift from the floor with a braced torso and controlled hip and knee extension.',
    ['Stand with the bar over the middle of your feet.', 'Hinge at the hips and grip the bar.', 'Brace your core and keep your back neutral.', 'Push the floor away as you stand.', 'Lower the bar with control.'],
    'Light dumbbell hip hinges.', 'Practice with a light kettlebell.', 'Increase load only with reliable technique.'),

  makeExercise(26, 'Barbell squat', 'Legs', 'Advanced', 'Gym', '6–10', '🏋️',
    'Keep the bar stable and squat through a comfortable range of motion.',
    ['Set the bar securely on your upper back.', 'Stand with feet stable.', 'Brace your core.', 'Bend your hips and knees together.', 'Stand up while keeping your balance.'],
    'Goblet squats.', 'Use goblet squats or an empty bar.', 'Progress load gradually with a spotter or safety bars.'),

  makeExercise(27, 'Bulgarian split squat', 'Legs', 'Advanced', 'Gym', '8–10 each leg', '🦵',
    'Place your rear foot on a stable bench and lower with control.',
    ['Stand in front of a stable bench.', 'Rest the top of your rear foot on the bench.', 'Keep your front foot stable.', 'Lower your hips under control.', 'Push through your front foot to stand.'],
    'Supported split squats.', 'Use bodyweight and hold support.', 'Add dumbbells gradually.'),

  makeExercise(28, 'Chest dips', 'Chest', 'Advanced', 'Home equipment', '6–10', '🔥',
    'Lean slightly forward and lower only through a comfortable shoulder range.',
    ['Grip stable parallel bars.', 'Support your body with straight arms.', 'Lean slightly forward.', 'Bend your elbows and lower carefully.', 'Press back up smoothly.'],
    'Incline push-ups.', 'Use assisted dips.', 'Add resistance only when controlled.'),

  makeExercise(29, 'Face pulls', 'Shoulders', 'Intermediate', 'Gym', '12–15', '💪',
    'Pull the rope toward your face while keeping your elbows high.',
    ['Set a cable rope around face height.', 'Grip both ends of the rope.', 'Step back until the cable is taut.', 'Pull toward your face.', 'Separate your hands and squeeze your upper back.'],
    'Resistance-band face pulls.', 'Use a lighter band.', 'Pause briefly at the end.'),

  makeExercise(30, 'Arnold press', 'Shoulders', 'Intermediate', 'Gym', '8–12', '🏋️',
    'Rotate your palms outward as you press the dumbbells overhead.',
    ['Hold dumbbells in front of your shoulders.', 'Start with palms facing you.', 'Rotate your palms outward as you press.', 'Extend overhead without arching your back.', 'Reverse the movement slowly.'],
    'Regular light dumbbell shoulder press.', 'Use lighter dumbbells.', 'Increase resistance gradually.'),

  makeExercise(31, 'Preacher curls', 'Arms', 'Advanced', 'Gym', '8–12', '💪',
    'Keep your upper arms supported and lower the weight slowly.',
    ['Sit at a preacher bench.', 'Rest your upper arms on the pad.', 'Grip the bar or dumbbells.', 'Curl upward without lifting your elbows.', 'Lower slowly without forcing the elbow joint.'],
    'Seated dumbbell curls.', 'Use lighter resistance.', 'Increase weight gradually.'),

  makeExercise(32, 'Skull crushers', 'Arms', 'Advanced', 'Gym', '8–12', '🏋️',
    'Bend your elbows to lower the weight carefully toward your forehead.',
    ['Lie on a bench with a light bar or dumbbells.', 'Extend your arms above your chest.', 'Keep your upper arms steady.', 'Bend your elbows slowly.', 'Extend your arms without swinging.'],
    'Resistance-band tricep extensions.', 'Use light dumbbells.', 'Increase resistance gradually.'),

  makeExercise(33, 'Hip thrust', 'Glutes', 'Beginner', 'Gym', '10–15', '🍑',
    'Drive through your feet and squeeze your glutes at the top.',
    ['Sit with your upper back supported by a bench.', 'Place your feet flat on the floor.', 'Keep your chin slightly tucked.', 'Drive your hips upward.', 'Lower your hips slowly.'],
    'Glute bridges on the floor.', 'Start with bodyweight glute bridges.', 'Add a dumbbell or barbell gradually.'),

  makeExercise(34, 'Hanging knee raises', 'Core', 'Advanced', 'Home equipment', '8–12', '🔥',
    'Raise your knees with control and avoid swinging.',
    ['Hang from a secure pull-up bar.', 'Brace your core.', 'Raise your knees toward your chest.', 'Pause briefly.', 'Lower slowly without swinging.'],
    'Lying knee raises.', 'Use lying knee raises.', 'Try straight-leg raises when ready.'),

  makeExercise(35, 'Burpees', 'Cardio', 'Advanced', 'No equipment', '8–12', '🏃',
    'Move from standing to a plank and back with controlled transitions.',
    ['Stand with feet shoulder-width apart.', 'Place your hands on the floor.', 'Step or jump your feet back to a plank.', 'Return your feet toward your hands.', 'Stand up and jump if comfortable.'],
    'Step-back burpees without a jump.', 'Remove the jump and step backward.', 'Increase pace gradually.'),

  makeExercise(36, 'Standing calf raises', 'Calves', 'Beginner', 'No equipment', '12–20', '🦵',
    'Rise onto the balls of your feet, pause briefly, then lower your heels slowly.',
    ['Stand tall with feet about hip-width apart, holding a stable support if needed.', 'Keep your knees softly extended and your weight balanced over your forefeet.', 'Lift your heels as high as comfortable.', 'Pause briefly at the top without rolling your ankles outward.', 'Lower your heels slowly until you feel a gentle stretch.'],
    'Single-leg calf raises while holding a wall or chair; use a step only when balance is secure.',
    'Perform seated calf raises or use both legs with hand support.',
    'Progress to single-leg calf raises or add external load gradually.')
];


// Women's Fitness library: balanced full-body training with an expanded
// lower-body/glute selection. These are optional focus choices, not women-only movements.
const womenFocusExercises = [
  makeExercise(37, 'Glute bridge', 'Glutes', 'Beginner', 'No equipment', '12–15', '🍑', 'Lift your hips by driving through your heels and gently squeezing your glutes.', ['Lie on your back with knees bent and feet flat.', 'Brace your abdomen gently.', 'Press through your heels and lift your hips.', 'Pause without arching your lower back.', 'Lower your hips slowly.'], 'Bodyweight hip thrust against a sofa.', 'Use a shorter range of motion.', 'Place a resistance band above your knees.'),
  makeExercise(38, 'Cable glute kickback', 'Glutes', 'Intermediate', 'Gym', '12–15 each leg', '🍑', 'Extend one leg behind you without arching your lower back.', ['Attach an ankle strap to a low cable.', 'Hold the machine for balance.', 'Brace your core and keep hips facing forward.', 'Move one leg back in a controlled arc.', 'Return slowly without letting the stack rest.'], 'Banded standing kickbacks.', 'Use a lighter load or a resistance band.', 'Increase resistance gradually.'),
  makeExercise(39, 'Hip abduction machine', 'Glutes', 'Beginner', 'Gym', '12–20', '🍑', 'Move your knees outward smoothly while keeping your torso stable.', ['Sit with your back supported.', 'Place knees against the pads.', 'Open your legs against the resistance.', 'Pause briefly without bouncing.', 'Return slowly.'], 'Side-lying leg raises or banded abductions.', 'Use a lighter setting.', 'Pause for two seconds at the open position.'),
  makeExercise(40, 'Cable pull-through', 'Glutes', 'Intermediate', 'Gym', '10–15', '🏋️', 'Hinge at the hips and stand by driving your hips forward.', ['Set a rope attachment low.', 'Face away and hold the rope between your legs.', 'Step forward until the cable is taut.', 'Push hips back with a neutral spine.', 'Drive hips forward to stand tall.'], 'Dumbbell Romanian deadlift.', 'Practice an unloaded hip hinge.', 'Increase resistance while keeping the spine neutral.'),
  makeExercise(41, 'Step-ups', 'Legs', 'Beginner', 'Home with equipment', '10 each leg', '🦵', 'Step onto a stable platform and control the descent.', ['Stand in front of a stable low step.', 'Place one whole foot on the platform.', 'Drive through that foot to stand.', 'Bring the other foot up.', 'Step down slowly and switch sides.'], 'Supported stair step-ups on a low step.', 'Use a lower platform and hold support.', 'Use dumbbells only when balance is reliable.'),
  makeExercise(42, 'Sumo squat', 'Glutes', 'Beginner', 'No equipment', '12–15', '🦵', 'Use a comfortable wide stance and keep knees tracking with toes.', ['Stand wider than shoulder width with toes slightly out.', 'Brace your core.', 'Bend hips and knees together.', 'Lower to a comfortable depth.', 'Push through the floor to stand.'], 'Supported wide-stance chair squat.', 'Use a smaller range of motion.', 'Hold a dumbbell at chest height.'),
  makeExercise(43, 'Seated leg curl', 'Legs', 'Beginner', 'Gym', '10–15', '🦵', 'Curl the pad toward you without lifting your hips.', ['Adjust the machine to fit your knees.', 'Sit with your back supported.', 'Curl the pad down and back.', 'Pause briefly.', 'Return slowly.'], 'Sliding hamstring curls with towels on a smooth floor.', 'Use a lighter load.', 'Increase resistance gradually.'),
  makeExercise(44, 'Leg extension', 'Legs', 'Beginner', 'Gym', '10–15', '🦵', 'Straighten your knees smoothly and lower the pad under control.', ['Adjust the machine so the pad rests above your ankles.', 'Sit with your back supported.', 'Extend your knees without kicking.', 'Pause briefly near the top.', 'Lower slowly.'], 'Seated knee extensions without load.', 'Use a lighter load and comfortable range.', 'Increase resistance gradually.'),
  makeExercise(45, 'Frog pumps', 'Glutes', 'Beginner', 'No equipment', '15–25', '🍑', 'Keep the soles of your feet together and lift your hips using your glutes.', ['Lie on your back.', 'Bring the soles of your feet together and let knees fall outward.', 'Brace your core.', 'Lift your hips by squeezing your glutes.', 'Lower slowly.'], 'Glute bridges.', 'Use a smaller range.', 'Add a light resistance band above the knees.'),
  makeExercise(46, 'Side-lying hip abduction', 'Glutes', 'Beginner', 'No equipment', '12–15 each side', '🍑', 'Lift the top leg without rolling your hips backward.', ['Lie on your side with legs straight.', 'Stack hips and shoulders.', 'Point toes forward slightly.', 'Lift the top leg smoothly.', 'Lower without resting fully.'], 'Standing side leg raises while holding a support.', 'Bend the bottom leg for balance.', 'Add a light ankle weight or band.'),
  makeExercise(47, 'Dead bug', 'Core', 'Beginner', 'No equipment', '8–12 each side', '🔥', 'Move opposite arm and leg while keeping your lower back gently supported.', ['Lie on your back with arms up and knees bent.', 'Brace your abdomen gently.', 'Extend one arm and the opposite leg.', 'Keep your trunk still and back controlled.', 'Return and alternate sides.'], 'Heel taps with knees bent.', 'Move one limb at a time.', 'Slow each repetition and pause.'),
  makeExercise(48, 'Bird dog', 'Core', 'Beginner', 'No equipment', '8–12 each side', '🤸', 'Reach opposite arm and leg while keeping your hips level.', ['Start on hands and knees.', 'Brace your abdomen.', 'Extend one arm and the opposite leg.', 'Keep hips level and avoid twisting.', 'Return slowly and switch sides.'], 'Extend one limb at a time.', 'Use a shorter reach.', 'Hold each extension for several seconds.'),
  makeExercise(49, 'Reverse crunch', 'Core', 'Intermediate', 'No equipment', '10–15', '🔥', 'Curl your pelvis gently toward your ribs without swinging your legs.', ['Lie on your back with knees bent.', 'Keep arms relaxed by your sides.', 'Brace your abdomen.', 'Curl your pelvis slightly off the floor.', 'Lower slowly without swinging.'], 'Bent-knee pelvic tilts.', 'Use a smaller range of motion.', 'Slow the lowering phase.'),
  makeExercise(50, 'Back extension', 'Back', 'Intermediate', 'Gym', '10–15', '🏋️', 'Raise your torso only to a straight line, avoiding excessive back extension.', ['Set up securely on a back-extension bench.', 'Cross arms over your chest.', 'Hinge at the hips with a neutral spine.', 'Raise until your body forms a straight line.', 'Lower slowly.'], 'Bird dog or floor superman with a small range.', 'Use a shorter range.', 'Hold a light weight only after mastering form.'),
  makeExercise(51, 'Single-leg Romanian deadlift', 'Legs', 'Advanced', 'Gym', '8–10 each leg', '🦵', 'Hinge at the hip while keeping your pelvis level and spine neutral.', ['Stand holding a light dumbbell.', 'Shift weight onto one foot with a soft knee.', 'Hinge forward as the free leg reaches back.', 'Keep hips square and spine neutral.', 'Drive through the standing foot to return.'], 'Bodyweight single-leg hip hinge while holding support.', 'Use bodyweight and hold a stable support.', 'Add load gradually when balance is controlled.')
];

const womenExercises = [
  ...exercises.filter(e => !['14','28','31','32','35'].includes(e.id)),
  ...womenFocusExercises
];

const extraMuscleTags = {
  '1':['triceps','front shoulders'], '2':['triceps','front shoulders'], '3':['triceps','front shoulders'], '4':['front shoulders'],
  '5':['biceps','forearms'], '6':['biceps','forearms'], '7':['biceps','forearms'], '8':['biceps','forearms'],
  '9':['triceps'], '10':['side delts'], '11':['biceps','forearms'], '12':['biceps','brachialis','forearms'],
  '13':['triceps'], '14':['triceps','chest'], '15':['quadriceps','glutes','hamstrings','calves'], '16':['quadriceps','glutes'],
  '17':['quadriceps','glutes'], '18':['hamstrings','glutes','lower back'], '19':['quadriceps','glutes','hamstrings'],
  '20':['abs','obliques'], '21':['abs'], '22':['abs','hip flexors'], '23':['abs','shoulders','quadriceps'],
  '24':['calves','quadriceps'], '25':['hamstrings','glutes','lower back','traps'], '26':['quadriceps','glutes','calves'],
  '27':['quadriceps','glutes'], '28':['triceps','chest','shoulders'], '29':['rear delts','upper back'], '30':['triceps','front shoulders'],
  '31':['biceps','forearms'], '32':['triceps'], '33':['glutes','hamstrings'], '34':['abs','hip flexors'],
  '35':['chest','shoulders','quadriceps','glutes','core'], '36':['calves','soleus','gastrocnemius','vádli']
};
exercises.forEach(e => { e.muscleTags = [...new Set([...(e.muscleTags || []), ...(extraMuscleTags[e.id] || [])].map(x => x.toLowerCase()))]; e.secondaryMuscles = extraMuscleTags[e.id] || []; });

const achievements = [
  { id: 'a1', name: 'First step', description: 'Complete your first workout', icon: '🌱', target: 1 },
  { id: 'a2', name: 'Getting started', description: 'Complete 3 workouts', icon: '💪', target: 3 },
  { id: 'a3', name: 'One week strong', description: 'Complete 7 workouts', icon: '🔥', target: 7 },
  { id: 'a4', name: 'Dedicated', description: 'Complete 10 workouts', icon: '🏆', target: 10 },
  { id: 'a5', name: 'Committed', description: 'Complete 20 workouts', icon: '🥇', target: 20 },
  { id: 'a6', name: 'Consistency', description: 'Reach a 3-day streak', icon: '⚡', streak: 3 },
  { id: 'a7', name: 'Unstoppable', description: 'Reach a 7-day streak', icon: '👑', streak: 7 }
];

const mealPresets = [
  { name: 'Eggs and toast', calories: 350, protein: 22, carbs: 30, fat: 15 },
  { name: 'Chicken and rice', calories: 550, protein: 45, carbs: 60, fat: 12 },
  { name: 'Greek yogurt', calories: 150, protein: 17, carbs: 10, fat: 4 },
  { name: 'Oatmeal', calories: 300, protein: 12, carbs: 48, fat: 7 },
  { name: 'Protein shake', calories: 180, protein: 30, carbs: 8, fat: 3 },
  { name: 'Salmon and potatoes', calories: 600, protein: 38, carbs: 55, fat: 22 }
];

const snackRecommendations = [
  {
    name: 'Greek yogurt with berries',
    serving: '200 g Greek yogurt + 80 g berries',
    calories: 190, protein: 20, carbs: 22, fat: 3,
    timing: 'Breakfast or snack',
    reason: 'Provides protein and carbohydrates in an easy-to-prepare snack.'
  },
  {
    name: 'Banana and peanut butter',
    serving: '1 medium banana + 15 g peanut butter',
    calories: 190, protein: 4, carbs: 30, fat: 8,
    timing: '30–60 minutes before training',
    reason: 'A convenient source of carbohydrates and energy.'
  },
  {
    name: 'Oatmeal',
    serving: '50 g oats + 200 ml milk',
    calories: 300, protein: 14, carbs: 43, fat: 8,
    timing: 'Breakfast or 1–2 hours before training',
    reason: 'Provides carbohydrates and some protein for a filling meal.'
  },
  {
    name: 'Cottage cheese with fruit',
    serving: '150 g cottage cheese + 1 small apple',
    calories: 210, protein: 19, carbs: 25, fat: 4,
    timing: 'Afternoon snack',
    reason: 'A protein-rich option with fruit for extra carbohydrates.'
  },
  {
    name: 'Protein shake',
    serving: '30 g protein powder + water',
    calories: 120, protein: 24, carbs: 3, fat: 2,
    timing: 'Convenient after training or between meals',
    reason: 'A quick way to add protein when it is useful.'
  },
  {
    name: 'Rice cakes with peanut butter',
    serving: '2 rice cakes + 15 g peanut butter',
    calories: 180, protein: 5, carbs: 23, fat: 8,
    timing: 'Before training or as a snack',
    reason: 'Easy to prepare and provides a mix of carbohydrates and fats.'
  },
  {
    name: 'Mixed nuts',
    serving: '25 g mixed nuts',
    calories: 150, protein: 5, carbs: 5, fat: 13,
    timing: 'Between meals',
    reason: 'A compact snack with healthy fats and some protein.'
  },
  {
    name: 'Chicken and rice',
    serving: '120 g chicken + 150 g cooked rice',
    calories: 390, protein: 39, carbs: 43, fat: 5,
    timing: 'After training or lunch',
    reason: 'Combines protein and carbohydrates in a balanced meal.'
  },
  {
    name: 'Eggs and wholegrain toast',
    serving: '2 eggs + 2 slices wholegrain bread',
    calories: 330, protein: 21, carbs: 30, fat: 14,
    timing: 'Breakfast or after training',
    reason: 'Provides protein, carbohydrates and several important nutrients.'
  },
  {
    name: 'Salmon and potatoes',
    serving: '120 g salmon + 200 g potatoes',
    calories: 430, protein: 28, carbs: 40, fat: 16,
    timing: 'Lunch or dinner',
    reason: 'A filling meal with protein, carbohydrates and omega-3 fats.'
  },
  {
    name: 'Yogurt and banana',
    serving: '170 g yogurt + 1 banana',
    calories: 210, protein: 12, carbs: 35, fat: 3,
    timing: 'Before or after training',
    reason: 'An easy combination of protein and carbohydrates.'
  },
  {
    name: 'Tuna sandwich',
    serving: '1 wholegrain sandwich with 80 g tuna',
    calories: 300, protein: 27, carbs: 35, fat: 5,
    timing: 'Lunch or snack',
    reason: 'A practical protein-rich meal that is easy to prepare.'
  }
];


const foodGuides = {
  'Eggs and toast': {
    serving: '2 large eggs + 2 slices wholegrain toast',
    goals: ['Muscle building', 'Recovery', 'Everyday energy'],
    bestFor: 'A balanced breakfast with protein, fats and carbohydrates.',
    benefits: 'Eggs provide complete protein, choline and vitamin B12. Wholegrain toast adds carbohydrates and fibre.',
    nutrients: 'Choline, vitamin B12, selenium and fibre (amounts vary by bread and preparation).',
    timing: 'Breakfast, or a meal 1–3 hours before training.',
    caution: 'Allergens: egg and usually wheat/gluten. Nutrition changes with butter, oil and toppings.',
    alternatives: 'Use wholegrain wraps instead of toast, or tofu scramble instead of eggs.'
  },
  'Chicken and rice': {
    serving: '150 g cooked chicken breast + 200 g cooked rice',
    goals: ['Muscle building', 'Recovery', 'Training energy'],
    bestFor: 'A protein-and-carbohydrate meal that fits many training goals.',
    benefits: 'Chicken supplies high-quality protein; rice supplies carbohydrates that help replenish muscle glycogen.',
    nutrients: 'Protein, niacin (B3), vitamin B6, selenium and carbohydrates.',
    timing: 'Lunch or after training; portion size can be adjusted to appetite and daily needs.',
    caution: 'Cook chicken thoroughly and refrigerate leftovers promptly. Add vegetables for fibre and variety.',
    alternatives: 'Try turkey, tofu or beans for protein; potatoes, pasta or quinoa instead of rice.'
  },
  'Greek yogurt': {
    serving: '200 g plain Greek yogurt',
    goals: ['Muscle building', 'Recovery', 'Satiety'],
    bestFor: 'An easy protein-rich snack or breakfast base.',
    benefits: 'Provides protein and calcium; choose plain yogurt to control added sugar.',
    nutrients: 'Calcium, vitamin B12 and often live cultures, depending on product.',
    timing: 'Breakfast, snack or after training as part of a meal.',
    caution: 'Contains milk. Protein and calories vary considerably between brands and fat levels.',
    alternatives: 'Use lactose-free Greek yogurt or a fortified soy yogurt with comparable protein.'
  },
  'Oatmeal': {
    serving: '50 g oats + 200 ml milk or fortified alternative',
    goals: ['Training energy', 'Muscle building', 'Satiety'],
    bestFor: 'A flexible carbohydrate-rich breakfast that can be made more protein-rich.',
    benefits: 'Oats provide slow-digesting carbohydrates and beta-glucan fibre; milk adds protein and calcium.',
    nutrients: 'Beta-glucan fibre, manganese, magnesium, iron and (with milk) calcium.',
    timing: 'Breakfast or around 1–2 hours before training if it feels comfortable.',
    caution: 'Oats contain fibre, which may feel heavy immediately before exercise. Check cross-contamination if avoiding gluten.',
    alternatives: 'Make with soy milk, add yogurt, or use rice porridge for a lower-fibre option.'
  },
  'Protein shake': {
    serving: '30 g protein powder mixed with water; follow the product label',
    goals: ['Muscle building', 'Recovery', 'Convenience'],
    bestFor: 'A convenient way to top up protein when regular food is not practical.',
    benefits: 'Supplies protein for muscle repair and growth when combined with appropriate training and total daily intake.',
    nutrients: 'Protein; micronutrients depend on the powder formulation.',
    timing: 'Whenever convenient, including after training; there is no narrow post-workout deadline.',
    caution: 'Not essential if protein needs are met through food. Check milk/soy allergens, sweeteners and serving size.',
    alternatives: 'Greek yogurt, cottage cheese, milk or a protein-rich soy drink.'
  },
  'Salmon and potatoes': {
    serving: '120–150 g cooked salmon + 200 g potatoes',
    goals: ['Recovery', 'Muscle building', 'Everyday health'],
    bestFor: 'A substantial meal with protein, carbohydrates and unsaturated fats.',
    benefits: 'Salmon provides high-quality protein and omega-3 fats; potatoes provide carbohydrates and potassium.',
    nutrients: 'Omega-3 EPA/DHA, vitamin D, vitamin B12, selenium and potassium.',
    timing: 'Lunch or dinner, including on training days.',
    caution: 'Contains fish. Choose varied protein sources across the week; preparation and added oil affect calories.',
    alternatives: 'Use trout or sardines instead of salmon, and rice or sweet potato instead of potatoes.'
  },
  'Greek yogurt with berries': {
    serving: '200 g Greek yogurt + 80 g berries', goals: ['Muscle building', 'Recovery', 'Satiety'],
    bestFor: 'A protein-rich snack with fruit.', benefits: 'Yogurt supplies protein and calcium; berries add fibre and colourful plant compounds.',
    nutrients: 'Calcium, vitamin B12, fibre and vitamin C (varies by berries).', timing: 'Breakfast or snack; also convenient after training.',
    caution: 'Contains milk. Sweetened yogurt can contain added sugar.', alternatives: 'Use lactose-free yogurt or fortified high-protein soy yogurt; choose fruit in season.'
  },
  'Banana and peanut butter': {
    serving: '1 medium banana + 15 g peanut butter', goals: ['Training energy', 'Weight gain support', 'Convenient snack'],
    bestFor: 'A quick carbohydrate-and-fat snack, especially when extra energy is useful.',
    benefits: 'Banana provides readily available carbohydrates and potassium; peanut butter adds energy and unsaturated fats.',
    nutrients: 'Potassium, vitamin B6, magnesium and unsaturated fats.', timing: 'About 30–90 minutes before training if tolerated, or between meals.',
    caution: 'Peanut is a major allergen. Fat in peanut butter may feel heavy immediately before intense exercise.', alternatives: 'Try banana with tahini or sunflower-seed butter if peanuts are unsuitable.'
  },
  'Cottage cheese with fruit': {
    serving: '150 g cottage cheese + 1 small apple', goals: ['Muscle building', 'Recovery', 'Satiety'],
    bestFor: 'A protein-rich snack with fruit and fibre.', benefits: 'Cottage cheese supplies casein-rich dairy protein; apple adds fibre and carbohydrates.',
    nutrients: 'Calcium, vitamin B12 and fibre.', timing: 'Afternoon snack or a light meal.', caution: 'Contains milk; sodium content varies by brand.', alternatives: 'Try skyr, plain high-protein yogurt or a fortified soy alternative.'
  },
  'Rice cakes with peanut butter': {
    serving: '2 rice cakes + 15 g peanut butter', goals: ['Training energy', 'Weight gain support', 'Convenient snack'],
    bestFor: 'A portable snack that combines carbohydrates and fats.', benefits: 'Rice cakes provide easy-to-digest carbohydrates; peanut butter makes the snack more energy-dense.',
    nutrients: 'Carbohydrates, niacin and unsaturated fats; exact micronutrients vary.', timing: 'Between meals or 1–2 hours before training.', caution: 'Contains peanuts. Rice cakes alone are low in protein and fibre.', alternatives: 'Use seed butter or pair with yogurt/soy yogurt for more protein.'
  },
  'Mixed nuts': {
    serving: '25–30 g unsalted mixed nuts (a small handful)', goals: ['Weight gain support', 'Everyday health', 'Satiety'],
    bestFor: 'A compact, energy-dense snack with unsaturated fats.', benefits: 'Nuts provide unsaturated fats, some protein and fibre; different nuts offer different micronutrients.',
    nutrients: 'Vitamin E, magnesium, copper and fibre, depending on the mix.', timing: 'Between meals or added to oats and yogurt.', caution: 'Tree nuts are common allergens; portions are energy-dense. Choose unsalted where possible.', alternatives: 'Use seeds such as pumpkin or sunflower seeds if suitable.'
  },
  'Eggs and wholegrain toast': {
    serving: '2 eggs + 2 slices wholegrain bread', goals: ['Muscle building', 'Recovery', 'Everyday energy'],
    bestFor: 'A balanced meal with protein, carbohydrates and fibre.', benefits: 'Eggs provide complete protein and choline; wholegrain bread contributes carbohydrates and fibre.',
    nutrients: 'Choline, vitamin B12, selenium and wholegrain fibre.', timing: 'Breakfast or a meal after training.', caution: 'Contains egg and wheat/gluten; added spreads change the nutrition values.', alternatives: 'Try tofu scramble or beans with wholegrain toast.'
  },
  'Yogurt and banana': {
    serving: '170–200 g plain yogurt + 1 medium banana', goals: ['Training energy', 'Recovery', 'Everyday snack'],
    bestFor: 'A simple mix of carbohydrates and protein.', benefits: 'Banana adds carbohydrates and potassium; yogurt provides protein and calcium.',
    nutrients: 'Potassium, calcium, vitamin B12 and vitamin B6.', timing: 'Before or after training, depending on digestion and appetite.', caution: 'Contains milk unless a dairy-free alternative is used; check added sugar.', alternatives: 'Use skyr or fortified soy yogurt and another fruit.'
  },
  'Tuna sandwich': {
    serving: '1 wholegrain sandwich with about 80 g drained tuna', goals: ['Muscle building', 'Recovery', 'Convenient meal'],
    bestFor: 'A practical protein-rich lunch or snack.', benefits: 'Tuna provides protein; wholegrain bread adds carbohydrates and fibre.',
    nutrients: 'Vitamin B12, selenium, iodine (varies) and wholegrain fibre.', timing: 'Lunch or a portable meal.', caution: 'Contains fish and wheat/gluten. Vary fish choices and follow local advice on tuna frequency due to mercury.', alternatives: 'Use salmon, chicken, eggs, chickpeas or tofu in the sandwich.'
  }
};

const getFoodGuide = food => foodGuides[food?.name] || {
  serving: food?.serving || 'Use the portion you actually ate and enter its measured nutrition values.',
  goals: ['Flexible everyday option'],
  bestFor: 'This is a custom food entry. Its suitability depends on its ingredients and your overall daily diet.',
  benefits: 'Review the ingredient list and nutrition label to understand what this food contributes.',
  nutrients: 'Micronutrient details are not available for this custom entry.',
  timing: 'Choose a time that fits your appetite, routine and training.',
  caution: 'Nutrition values for custom foods are user-entered and have not been independently verified.',
  alternatives: 'Compare similar foods by serving size, protein, fibre, ingredients and allergens.'
};

const stretchLibrary = [
  { id: 's1', name: 'Neck side stretch', group: 'Neck', duration: 30, type: 'Static', steps: 'Sit or stand tall. Gently tilt one ear toward your shoulder. Keep the opposite shoulder relaxed. Repeat on the other side.', breathing: 'Breathe slowly and naturally.', benefit: 'May help reduce the feeling of tension around the neck.', mistakes: 'Do not pull your head forcefully or rotate sharply.' },
  { id: 's2', name: 'Shoulder circles', group: 'Shoulders', duration: 30, type: 'Dynamic', steps: 'Raise your shoulders gently, roll them backward and lower them. Repeat, then reverse direction.', breathing: 'Breathe naturally throughout.', benefit: 'Warms up the shoulder area and encourages comfortable movement.', mistakes: 'Avoid fast or exaggerated circles.' },
  { id: 's3', name: 'Cross-body shoulder stretch', group: 'Shoulders', duration: 30, type: 'Static', steps: 'Bring one arm across your chest. Use the other arm to support it gently. Switch sides halfway through.', breathing: 'Keep breathing slowly.', benefit: 'Stretches the back of the shoulder.', mistakes: 'Do not pull on the elbow joint.' },
  { id: 's4', name: 'Doorway chest stretch', group: 'Chest', duration: 30, type: 'Static', steps: 'Place your forearm against a doorway. Step forward slightly until you feel a gentle stretch across your chest. Switch sides.', breathing: 'Take slow, relaxed breaths.', benefit: 'Can help improve comfortable chest and shoulder mobility.', mistakes: 'Do not force your shoulder backward.' },
  { id: 's5', name: 'Cat-cow', group: 'Back', duration: 40, type: 'Dynamic', steps: 'Start on hands and knees. Round your back gently, then slowly let your abdomen lower as you lift your chest.', breathing: 'Exhale while rounding; inhale while opening.', benefit: 'Encourages movement through the spine.', mistakes: 'Avoid forcing the lower back.' },
  { id: 's6', name: 'Child’s pose', group: 'Back', duration: 40, type: 'Static', steps: 'Kneel, sit your hips toward your heels and reach your arms forward. Rest in a comfortable position.', breathing: 'Breathe deeply and gently.', benefit: 'Offers a gentle stretch through the back.', mistakes: 'Do not force your hips toward your heels.' },
  { id: 's7', name: 'Tricep stretch', group: 'Arms', duration: 30, type: 'Static', steps: 'Raise one arm overhead, bend the elbow and gently support it with your other hand. Switch sides halfway through.', breathing: 'Breathe naturally.', benefit: 'Stretches the triceps and upper arm.', mistakes: 'Do not push hard on the elbow.' },
  { id: 's8', name: 'Wrist circles', group: 'Arms', duration: 30, type: 'Dynamic', steps: 'Extend your arms comfortably and slowly rotate your wrists in both directions.', breathing: 'Keep breathing normally.', benefit: 'Encourages comfortable wrist movement.', mistakes: 'Avoid fast or painful rotations.' },
  { id: 's9', name: 'Cobra stretch', group: 'Abs', duration: 30, type: 'Static', steps: 'Lie face down, place your hands under your shoulders and gently lift your chest. Keep the movement comfortable.', breathing: 'Breathe slowly.', benefit: 'Gently opens the front of the torso.', mistakes: 'Do not force your lower back into a deep arch.' },
  { id: 's10', name: 'Hip flexor stretch', group: 'Hips', duration: 40, type: 'Static', steps: 'Kneel in a lunge position. Gently move your hips forward while keeping your torso upright. Switch sides halfway through.', breathing: 'Breathe slowly and evenly.', benefit: 'Stretches the front of the hip.', mistakes: 'Avoid arching your lower back.' },
  { id: 's11', name: 'Standing quad stretch', group: 'Quads', duration: 30, type: 'Static', steps: 'Stand tall and hold one ankle behind you. Keep your knees close and gently bring your heel toward your glutes. Switch sides.', breathing: 'Breathe naturally.', benefit: 'Stretches the front of the thigh.', mistakes: 'Do not pull your ankle forcefully.' },
  { id: 's12', name: 'Hamstring stretch', group: 'Hamstrings', duration: 40, type: 'Static', steps: 'Extend one leg forward with a soft knee. Hinge gently at the hips until you feel a stretch. Switch sides halfway through.', breathing: 'Keep your breathing relaxed.', benefit: 'Stretches the back of the thigh.', mistakes: 'Do not round your back aggressively.' },
  { id: 's13', name: 'Figure-four stretch', group: 'Glutes', duration: 40, type: 'Static', steps: 'Lie on your back, cross one ankle over the opposite knee and gently draw the supporting leg toward you. Switch sides halfway through.', breathing: 'Breathe slowly.', benefit: 'Stretches the glute area.', mistakes: 'Avoid pulling the knee directly.' },
  { id: 's14', name: 'Calf stretch', group: 'Calves', duration: 30, type: 'Static', steps: 'Place your hands against a wall. Step one foot back and press its heel gently toward the floor. Switch sides halfway through.', breathing: 'Breathe naturally.', benefit: 'Stretches the calf muscles.', mistakes: 'Keep the back heel comfortably grounded.' },
  { id: 's15', name: 'Arm and leg reach', group: 'Full Body', duration: 40, type: 'Dynamic', steps: 'Stand tall, reach both arms overhead, then gently reach toward each side. Move smoothly and comfortably.', breathing: 'Inhale as you reach up, exhale as you lower.', benefit: 'A gentle full-body mobility movement.', mistakes: 'Avoid bouncing or forcing the movement.' }
];

const stretchGroups = [
  'Neck', 'Shoulders', 'Chest', 'Back', 'Arms', 'Abs',
  'Hips', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Full Body'
];

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const defaultTrainingDays = count => [0, 2, 4, 6, 1, 3].slice(0, count).sort((a, b) => a - b);

const workoutSplits = {
  2: [
    { name: 'Full Body A', muscles: ['Chest', 'Back', 'Legs', 'Shoulders', 'Core'] },
    { name: 'Full Body B', muscles: ['Legs', 'Back', 'Chest', 'Arms', 'Core'] }
  ],
  3: [
    { name: 'Push Day', muscles: ['Chest', 'Shoulders', 'Arms'] },
    { name: 'Pull Day', muscles: ['Back', 'Arms'] },
    { name: 'Legs & Core', muscles: ['Legs', 'Glutes', 'Core'] }
  ],
  4: [
    { name: 'Upper Body A', muscles: ['Chest', 'Back', 'Shoulders', 'Arms'] },
    { name: 'Lower Body A', muscles: ['Legs', 'Glutes', 'Core'] },
    { name: 'Upper Body B', muscles: ['Back', 'Chest', 'Arms', 'Shoulders'] },
    { name: 'Lower Body B', muscles: ['Legs', 'Glutes', 'Core'] }
  ],
  5: [
    { name: 'Push Day', muscles: ['Chest', 'Shoulders', 'Arms'] },
    { name: 'Pull Day', muscles: ['Back', 'Arms'] },
    { name: 'Legs Day', muscles: ['Legs', 'Glutes', 'Core'] },
    { name: 'Upper Body', muscles: ['Chest', 'Back', 'Shoulders'] },
    { name: 'Lower Body & Core', muscles: ['Legs', 'Glutes', 'Core'] }
  ],
  6: [
    { name: 'Push A', muscles: ['Chest', 'Shoulders', 'Arms'] },
    { name: 'Pull A', muscles: ['Back', 'Arms'] },
    { name: 'Legs A', muscles: ['Legs', 'Glutes', 'Core'] },
    { name: 'Push B', muscles: ['Chest', 'Shoulders', 'Arms'] },
    { name: 'Pull B', muscles: ['Back', 'Arms'] },
    { name: 'Legs B', muscles: ['Legs', 'Glutes', 'Core'] }
  ]
};

const womenWorkoutSplits = {
  2: [
    { name: 'Full Body & Glutes A', muscles: ['Glutes', 'Legs', 'Back', 'Chest', 'Core'] },
    { name: 'Full Body & Glutes B', muscles: ['Legs', 'Glutes', 'Shoulders', 'Back', 'Core'] }
  ],
  3: [
    { name: 'Lower Body & Glutes', muscles: ['Glutes', 'Legs', 'Core'] },
    { name: 'Upper Body & Core', muscles: ['Back', 'Chest', 'Shoulders', 'Arms', 'Core'] },
    { name: 'Glutes, Legs & Full Body', muscles: ['Glutes', 'Legs', 'Core', 'Back'] }
  ],
  4: [
    { name: 'Lower Body & Glutes A', muscles: ['Glutes', 'Legs', 'Core'] },
    { name: 'Upper Body A', muscles: ['Back', 'Chest', 'Shoulders', 'Arms'] },
    { name: 'Lower Body & Glutes B', muscles: ['Glutes', 'Legs', 'Core'] },
    { name: 'Upper Body & Core B', muscles: ['Back', 'Chest', 'Shoulders', 'Arms', 'Core'] }
  ],
  5: [
    { name: 'Glutes & Hamstrings', muscles: ['Glutes', 'Legs'] },
    { name: 'Upper Body & Core', muscles: ['Back', 'Chest', 'Shoulders', 'Arms', 'Core'] },
    { name: 'Quads & Glutes', muscles: ['Legs', 'Glutes', 'Core'] },
    { name: 'Upper Body B', muscles: ['Back', 'Chest', 'Shoulders', 'Arms'] },
    { name: 'Glutes & Full Body', muscles: ['Glutes', 'Legs', 'Core', 'Back'] }
  ],
  6: [
    { name: 'Glutes & Hamstrings A', muscles: ['Glutes', 'Legs'] },
    { name: 'Upper Body A', muscles: ['Back', 'Chest', 'Shoulders', 'Arms'] },
    { name: 'Quads & Core', muscles: ['Legs', 'Glutes', 'Core'] },
    { name: 'Upper Body B', muscles: ['Back', 'Chest', 'Shoulders', 'Arms'] },
    { name: 'Glutes & Hamstrings B', muscles: ['Glutes', 'Legs'] },
    { name: 'Full Body & Core', muscles: ['Glutes', 'Legs', 'Back', 'Core'] }
  ]
};

const routinePresets = [
  { name: 'Full Body Stretching', groups: stretchGroups },
  { name: 'Pre-Workout Warm-up', groups: ['Shoulders', 'Chest', 'Back', 'Hips', 'Quads', 'Calves'] },
  { name: 'Post-Workout Stretching', groups: ['Chest', 'Back', 'Shoulders', 'Hips', 'Hamstrings', 'Quads', 'Glutes'] },
  { name: 'Morning Mobility', groups: ['Neck', 'Shoulders', 'Back', 'Hips', 'Hamstrings', 'Full Body'] },
  { name: 'Rest Day Recovery', groups: ['Back', 'Hips', 'Hamstrings', 'Glutes', 'Calves'] }
];


// Search metadata includes important secondary muscles so muscle-based search
// can find compound movements as well as direct isolation exercises.
const exerciseMuscleMetadata = {
  'Bench press': ['Chest','Triceps','Shoulders'],
  'Incline dumbbell press': ['Chest','Shoulders','Triceps'],
  'Push-ups': ['Chest','Triceps','Shoulders','Core'],
  'Cable fly': ['Chest','Shoulders'],
  'Lat pulldown': ['Back','Biceps','Forearms'],
  'Seated cable row': ['Back','Biceps','Forearms'],
  'Pull-ups': ['Back','Biceps','Forearms','Core'],
  'Dumbbell row': ['Back','Biceps','Forearms'],
  'Shoulder press': ['Shoulders','Triceps','Core'],
  'Lateral raises': ['Shoulders'],
  'Bicep curls': ['Biceps','Forearms'],
  'Hammer curls': ['Biceps','Forearms'],
  'Tricep pushdown': ['Triceps'],
  'Tricep dips': ['Triceps','Chest','Shoulders'],
  'Squats': ['Quadriceps','Glutes','Hamstrings','Core'],
  'Goblet squat': ['Quadriceps','Glutes','Core'],
  'Leg press': ['Quadriceps','Glutes','Hamstrings'],
  'Romanian deadlift': ['Hamstrings','Glutes','Back'],
  'Lunges': ['Quadriceps','Glutes','Hamstrings','Core'],
  'Plank': ['Core','Shoulders'],
  'Crunches': ['Core'],
  'Leg raises': ['Core'],
  'Mountain climbers': ['Core','Shoulders','Cardio'],
  'Deadlift': ['Back','Glutes','Hamstrings','Forearms'],
  'Barbell squat': ['Quadriceps','Glutes','Hamstrings','Core'],
  'Bulgarian split squat': ['Quadriceps','Glutes','Hamstrings','Core'],
  'Chest dips': ['Chest','Triceps','Shoulders'],
  'Face pulls': ['Shoulders','Back'],
  'Arnold press': ['Shoulders','Triceps'],
  'Preacher curls': ['Biceps','Forearms'],
  'Skull crushers': ['Triceps'],
  'Hip thrust': ['Glutes','Hamstrings'],
  'Hanging knee raises': ['Core','Forearms'],
  'Standing calf raises': ['Calves'],
  'Glute bridge': ['Glutes','Hamstrings','Core'],
  'Cable glute kickback': ['Glutes'],
  'Hip abduction machine': ['Glutes'],
  'Cable pull-through': ['Glutes','Hamstrings','Back'],
  'Step-ups': ['Quadriceps','Glutes','Hamstrings'],
  'Sumo squat': ['Glutes','Quadriceps','Adductors'],
  'Seated leg curl': ['Hamstrings'],
  'Leg extension': ['Quadriceps'],
  'Frog pumps': ['Glutes'],
  'Side-lying hip abduction': ['Glutes'],
  'Dead bug': ['Core'],
  'Bird dog': ['Core','Back'],
  'Reverse crunch': ['Core'],
  'Back extension': ['Back','Glutes','Hamstrings'],
  'Single-leg Romanian deadlift': ['Hamstrings','Glutes','Back','Core']
};
[...exercises, ...womenFocusExercises].forEach(exercise => {
  const muscles = exerciseMuscleMetadata[exercise.name] || [exercise.muscle];
  exercise.primaryMuscles = [exercise.muscle];
  exercise.secondaryMuscles = muscles.filter(m => m !== exercise.muscle);
  exercise.muscleTags = [...new Set(muscles.map(m => m.toLowerCase()))];
});

class BIFITErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    this.setState({ info: info && info.componentStack ? info.componentStack : '' });
    console.error('BIFIT render error:', error, info);
  }
  render() {
    if (this.state.error) {
      const message = this.state.error && this.state.error.message
        ? this.state.error.message
        : String(this.state.error);
      return (
        <View style={{ flex: 1, backgroundColor: '#10120F', padding: 22, justifyContent: 'center' }}>
          <RNText style={{ color: '#B6F36A', fontSize: 23, fontWeight: '800', marginBottom: 12 }}>BIFIT hibát észlelt</RNText>
          <RNText selectable style={{ color: '#FFFFFF', fontSize: 15, lineHeight: 22, marginBottom: 14 }}>{message}</RNText>
          <RNText selectable style={{ color: '#D0D0D0', fontSize: 11, lineHeight: 16 }}>{this.state.info || 'Nincs további komponensinformáció.'}</RNText>
          <RNText style={{ color: '#92998C', fontSize: 12, marginTop: 18 }}>Készíts képernyőképet erről a hibaüzenetről, és küldd el.</RNText>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { width: windowWidth } = useWindowDimensions();
  const deviceColorScheme = useColorScheme();
  const isWideScreen = windowWidth >= 760;
  const [tab, setTab] = useState('Home');
  const [answers, setAnswers] = useState(defaultAnswers);
  const [muscleFocus, setMuscleFocus] = useState({});
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileXpAwarded, setProfileXpAwarded] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [step, setStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [language, setLanguage] = useState('en');
  const [themeMode, setThemeMode] = useState('dark'); // dark | light | system
  const [glassSizeMl, setGlassSizeMl] = useState(250);
  const [glassSizeInput, setGlassSizeInput] = useState('250');
  const [restSeconds, setRestSeconds] = useState(90);
  const [allergies, setAllergies] = useState('');
  const [foodPreference, setFoodPreference] = useState('No preference');
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [volumeUnit, setVolumeUnit] = useState('ml');
  const [textSize, setTextSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [weeklySummaryEnabled, setWeeklySummaryEnabled] = useState(true);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportDataText, setExportDataText] = useState('');
  const [profileGender, setProfileGender] = useState('male');
  const [profileChoiceLocked, setProfileChoiceLocked] = useState(false);
  const [genderProfiles, setGenderProfiles] = useState({});
  const activeExercises = profileGender === 'female' ? womenExercises : exercises;
  const accentColor = profileGender === 'female' ? '#F28AB2' : GREEN;
  const resolvedTheme = themeMode === 'system' ? (deviceColorScheme === 'light' ? 'light' : 'dark') : themeMode;
  const styles = useMemo(() => createStyles(accentColor, resolvedTheme, highContrast), [accentColor, resolvedTheme, highContrast]);
  const showAlert = (title, message) => Alert.alert(translateString(title, language), translateString(message, language));
  const playSound = (kind = 'tap') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const settings = kind === 'success'
        ? { frequency: 740, duration: 0.18 }
        : kind === 'achievement'
          ? { frequency: 880, duration: 0.24 }
          : { frequency: 520, duration: 0.055 };
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(settings.frequency, context.currentTime);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.06, context.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + settings.duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      const play = () => {
        oscillator.start();
        oscillator.stop(context.currentTime + settings.duration + 0.03);
      };
      if (context.state === 'suspended' && typeof context.resume === 'function') {
        context.resume().then(play).catch(() => context.close());
      } else {
        play();
      }
      oscillator.onended = () => context.close();
    } catch (e) {
      // Audio is optional; unsupported browsers should never interrupt app use.
    }
  };
  const [selectedTrainingDays, setSelectedTrainingDays] = useState([0, 2, 4]);
  const [calendarMonth, setCalendarMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(todayKey());

  const [completedDates, setCompletedDates] = useState([]);
  const [water, setWater] = useState(0);
  const [waterDate, setWaterDate] = useState(todayKey());
  const [weightEntries, setWeightEntries] = useState([]);
  const [xp, setXp] = useState(0);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [foodEntries, setFoodEntries] = useState([]);

  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [selectedWorkoutDay, setSelectedWorkoutDay] = useState((new Date().getDay() + 6) % 7);

  const [foodSearch, setFoodSearch] = useState('');
  const [foodDbResults, setFoodDbResults] = useState([]);
  const [foodDbLoading, setFoodDbLoading] = useState(false);
  const [foodDbError, setFoodDbError] = useState('');
  const [selectedDbFood, setSelectedDbFood] = useState(null);
  const [foodPortionGrams, setFoodPortionGrams] = useState('100');
  const [savedFoods, setSavedFoods] = useState([]);
  const [savedMeals, setSavedMeals] = useState([]);
  const [mealForm, setMealForm] = useState({ name: '', category: 'Breakfast', calories: '', protein: '', carbs: '', fat: '' });
  const [selectedFood, setSelectedFood] = useState(null);
  const [activeInfo, setActiveInfo] = useState(null);
  const [customFood, setCustomFood] = useState({
    name: '', calories: '', protein: '', carbs: '', fat: ''
  });

  const [goalCalories, setGoalCalories] = useState(2400);
  const [goalProtein, setGoalProtein] = useState(150);
  const [goalWater, setGoalWater] = useState(8);
  const [goalCarbs, setGoalCarbs] = useState(250);
  const [goalFat, setGoalFat] = useState(70);

  const [selectedGroups, setSelectedGroups] = useState(['Full Body']);
  const [activeRoutine, setActiveRoutine] = useState([]);
  const [activeRoutineName, setActiveRoutineName] = useState('');
  const [activeStretchIndex, setActiveStretchIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [stretchDone, setStretchDone] = useState([]);

  const [strengthForm, setStrengthForm] = useState({
    exercise: 'Bench press',
    weight: '',
    reps: '',
    sets: '3'
  });
  const [strengthLogs, setStrengthLogs] = useState([]);
  const [strengthFilter, setStrengthFilter] = useState('Bench press');

  const [expandedExerciseInfo, setExpandedExerciseInfo] = useState(false);
  const [chatMessages] = useState([
    {
      id: 'welcome',
      from: 'coach',
      text: "Hey! Welcome to BIFIT. Your AI Coach is coming soon!"
    }
  ]);

  const today = todayKey();

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const d = JSON.parse(raw);
          setAnswers({ ...defaultAnswers, ...(d.answers || {}) });
          setMuscleFocus(d.muscleFocus && typeof d.muscleFocus === 'object' ? d.muscleFocus : {});
          setLanguage(d.language === 'hu' ? 'hu' : 'en');
          const savedTheme = ['dark', 'light', 'system'].includes(d.themeMode) ? d.themeMode : 'dark';
          setThemeMode(savedTheme);
          const savedGlass = Math.min(5000, Math.max(225, Number(d.glassSizeMl) || 250));
          setGlassSizeMl(savedGlass);
          setGlassSizeInput(String(savedGlass));
          setRestSeconds([30, 45, 60, 90, 120, 180].includes(Number(d.restSeconds)) ? Number(d.restSeconds) : 90);
          setAllergies(typeof d.allergies === 'string' ? d.allergies : '');
          setFoodPreference(typeof d.foodPreference === 'string' ? d.foodPreference : 'No preference');
          setMealsPerDay(Math.min(6, Math.max(2, Number(d.mealsPerDay) || 3)));
          setWeightUnit(d.weightUnit === 'lb' ? 'lb' : 'kg');
          setHeightUnit(d.heightUnit === 'in' ? 'in' : 'cm');
          setVolumeUnit(d.volumeUnit === 'oz' ? 'oz' : 'ml');
          setTextSize(['small', 'normal', 'large'].includes(d.textSize) ? d.textSize : 'normal');
          setHighContrast(!!d.highContrast);
          setReduceMotion(!!d.reduceMotion);
          setSoundEnabled(d.soundEnabled !== false);
          setWeeklySummaryEnabled(d.weeklySummaryEnabled !== false);
          setProfileGender(d.profileGender === 'female' ? 'female' : 'male');
          setProfileChoiceLocked(d.profileChoiceLocked !== undefined ? !!d.profileChoiceLocked : !!d.profileComplete);
          setGenderProfiles(d.genderProfiles && typeof d.genderProfiles === 'object' ? d.genderProfiles : {});
          setSelectedTrainingDays(Array.isArray(d.selectedTrainingDays) && d.selectedTrainingDays.length ? d.selectedTrainingDays : defaultTrainingDays(Math.min(6, Math.max(2, parseInt((d.answers || {}).days, 10) || 3))));
          setProfileComplete(!!d.profileComplete);
          setProfileXpAwarded(d.profileXpAwarded !== undefined ? !!d.profileXpAwarded : !!d.profileComplete);
          setCompletedDates(d.completedDates || []);
          setWater(d.waterDate === todayKey() ? (d.water || 0) : 0);
          setWaterDate(todayKey());
          setWeightEntries(d.weightEntries || []);
          setXp(d.xp || 0);
          setWorkoutLogs(d.workoutLogs || []);
          setFoodEntries(d.foodEntries || []);
          setSavedFoods(Array.isArray(d.savedFoods) ? d.savedFoods : []);
          setSavedMeals(Array.isArray(d.savedMeals) ? d.savedMeals : []);
          setGoalCalories(d.goalCalories || 2400);
          setGoalProtein(d.goalProtein || 150);
          setGoalWater(d.goalWater || Math.ceil(2000 / savedGlass));
          setGoalCarbs(d.goalCarbs || 250);
          setGoalFat(d.goalFat || 70);
          setStrengthLogs(d.strengthLogs || []);
          setStretchDone(d.stretchDone || []);
        }
      } catch (e) {
        console.log('Load error:', e);
      } finally {
        setHydrated(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      answers, muscleFocus, profileComplete, profileXpAwarded, completedDates, water, waterDate,
      weightEntries, xp, workoutLogs, foodEntries, savedFoods, savedMeals,
      goalCalories, goalProtein, goalWater, goalCarbs, goalFat, glassSizeMl, themeMode,
      restSeconds, allergies, foodPreference, mealsPerDay, weightUnit, heightUnit, volumeUnit,
      textSize, highContrast, reduceMotion, soundEnabled, weeklySummaryEnabled,
      strengthLogs, stretchDone, language, selectedTrainingDays, profileGender, profileChoiceLocked,
      genderProfiles: { ...genderProfiles, [profileGender]: { answers, muscleFocus, profileComplete, selectedTrainingDays, goalCalories, goalProtein, goalWater, goalCarbs, goalFat } }
    })).catch(e => console.log('Save error:', e));
  }, [
    hydrated, answers, muscleFocus, profileComplete, profileXpAwarded, completedDates, water, waterDate,
    weightEntries, xp, workoutLogs, foodEntries, savedMeals,
    goalCalories, goalProtein, goalWater, goalCarbs, goalFat, glassSizeMl, themeMode,
    restSeconds, allergies, foodPreference, mealsPerDay, weightUnit, heightUnit, volumeUnit,
    textSize, highContrast, reduceMotion, soundEnabled, weeklySummaryEnabled,
    strengthLogs, stretchDone, language, selectedTrainingDays, profileGender, profileChoiceLocked, genderProfiles, goalCalories, goalProtein, goalWater, goalCarbs, goalFat
  ]);

  useEffect(() => {
    if (waterDate !== today) {
      setWater(0);
      setWaterDate(today);
    }
  }, [today, waterDate]);

  const update = (key, value) => setAnswers(p => ({ ...p, [key]: value }));

  const dayCount = Math.min(6, Math.max(2, parseInt(answers.days, 10) || 3));

  const calculatedTargets = useMemo(() => {
    const age = Number(answers.age);
    const height = Number(answers.height);
    const weight = Number(answers.weight);

    if (!age || !height || !weight) {
      return { calories: 2400, protein: 150, carbs: 250, fat: 70 };
    }

    // Mifflin–St Jeor estimate selected from the user's chosen profile.
    const sexConstant = profileGender === 'female' ? -161 : 5;
    const bmr = 10 * weight + 6.25 * height - 5 * age + sexConstant;
    const activity = 1.35 + (dayCount - 2) * 0.05;
    const maintenance = bmr * activity;

    let calories = maintenance;
    if (answers.goal === 'Build muscle') calories += 200;
    if (answers.goal === 'Lose body fat' && age >= 18) calories -= 300;

    // For users under 18, avoid automatically applying a calorie deficit.
    if (age < 18) calories = maintenance;

    const protein = Math.round(weight * 1.8);
    const fat = Math.round(weight * 0.8);
    const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

    return {
      calories: Math.round(calories / 50) * 50,
      protein,
      carbs,
      fat
    };
  }, [answers.age, answers.height, answers.weight, answers.goal, dayCount, profileGender]);

  useEffect(() => {
    if (!profileComplete) return;
    setGoalCalories(calculatedTargets.calories);
    setGoalProtein(calculatedTargets.protein);
    setGoalCarbs(calculatedTargets.carbs);
    setGoalFat(calculatedTargets.fat);
  }, [profileComplete, calculatedTargets]);

  const workoutCount = completedDates.length;

  const streak = useMemo(() => {
    const dates = new Set(completedDates);
    const cursor = new Date();

    if (!dates.has(dateKey(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
      if (!dates.has(dateKey(cursor))) return 0;
    }

    let n = 0;
    while (dates.has(dateKey(cursor))) {
      n++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return n;
  }, [completedDates]);

  const weeklyCount = useMemo(() => {
    let n = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (completedDates.includes(dateKey(d))) n++;
    }
    return n;
  }, [completedDates]);

  const level = Math.floor(xp / 500) + 1;
  const levelProgress = xp % 500;
  const unlocked = achievements.filter(a =>
    a.target ? workoutCount >= a.target : streak >= a.streak
  ).length;

  const todayFood = foodEntries.filter(f => f.date === today);
  const totals = todayFood.reduce((a, f) => ({
    calories: a.calories + Number(f.calories || 0),
    protein: a.protein + Number(f.protein || 0),
    carbs: a.carbs + Number(f.carbs || 0),
    fat: a.fat + Number(f.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const progress = (value, total) => (
    <View style={styles.track}>
      <View style={[styles.fill, {
        width: `${Math.min(100, total ? value / total * 100 : 0)}%`
      }]} />
    </View>
  );

  const heading = (title, right = '') => (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.muted}>{right}</Text>
    </View>
  );

  const card = (children, extra = {}) => (
    <View style={[styles.card, extra]}>{children}</View>
  );

  const button = (label, onPress, secondary = false) => (
    <TouchableOpacity
      style={secondary ? styles.secondaryButton : styles.greenButton}
      onPress={() => {
        playSound('tap');
        onPress();
      }}
    >
      <Text style={secondary ? styles.secondaryButtonText : styles.greenButtonText}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const chooseInitialProfile = (gender) => {
    if (profileChoiceLocked) return;
    setProfileGender(gender);
    setProfileChoiceLocked(true);
    playSound('success');
  };

  const switchFitnessProfile = (gender) => {
    if (gender === profileGender) return;
    const currentSnapshot = {
      answers, muscleFocus, profileComplete, selectedTrainingDays,
      goalCalories, goalProtein, goalWater, goalCarbs, goalFat
    };
    const savedTarget = genderProfiles[gender];
    setGenderProfiles(previous => ({ ...previous, [profileGender]: currentSnapshot }));
    setProfileGender(gender);
    setProfileChoiceLocked(true);
    setTab('Home');
    setSelectedExercise(null);
    setWorkoutStarted(false);
    setCompletedExercises([]);
    if (savedTarget) {
      setAnswers({ ...defaultAnswers, ...(savedTarget.answers || {}) });
      setMuscleFocus(savedTarget.muscleFocus || {});
      setProfileComplete(!!savedTarget.profileComplete);
      setSelectedTrainingDays(savedTarget.selectedTrainingDays || defaultTrainingDays(Math.min(6, Math.max(2, parseInt((savedTarget.answers || {}).days, 10) || 3))));
      setGoalCalories(savedTarget.goalCalories || 2400);
      setGoalProtein(savedTarget.goalProtein || 150);
      setGoalWater(savedTarget.goalWater || 8);
      setGoalCarbs(savedTarget.goalCarbs || 250);
      setGoalFat(savedTarget.goalFat || 70);
      setShowPersonalization(false);
    } else {
      setAnswers(defaultAnswers);
      setMuscleFocus({});
      setProfileComplete(false);
      setSelectedTrainingDays([0, 2, 4]);
      setGoalCalories(2400);
      setGoalProtein(150);
      setGoalWater(8);
      setGoalCarbs(250);
      setGoalFat(70);
      setStep(0);
      setShowPersonalization(true);
    }
    playSound('success');
  };

  const startPersonalization = () => {
    setStep(0);
    setShowPersonalization(true);
  };

  const finishPersonalization = () => {
    const age = Number(answers.age);
    const height = Number(answers.height);
    const weight = Number(answers.weight);

    if (!age || age < 13 || age > 100) {
      showAlert('Check your age', 'Enter an age between 13 and 100.');
      setStep(2);
      return;
    }
    if (!height || height < 100 || height > 250) {
      showAlert('Check your height', 'Enter a height between 100 and 250 cm.');
      setStep(2);
      return;
    }
    if (!weight || weight < 25 || weight > 300) {
      showAlert('Check your weight', 'Enter a valid weight.');
      setStep(2);
      return;
    }

    const requiredDays = Math.min(6, Math.max(2, parseInt(answers.days, 10) || 3));
    if (selectedTrainingDays.length !== requiredDays) {
      showAlert('Choose your training days', `Please select exactly ${requiredDays} weekdays.`);
      setStep(4);
      return;
    }

    setProfileComplete(true);
    setShowPersonalization(false);
    setTab('Home');
    if (!profileXpAwarded) {
      setXp(p => p + 50);
      setProfileXpAwarded(true);
      playSound('success');
      showAlert('Profile created! 🎉', 'You earned 50 XP.');
    } else {
      playSound('success');
    }
  };

  const steps = [
    {
      title: "What's your main goal?",
      subtitle: 'Your plan will be adapted to your goal.',
      key: 'goal',
      options: ['Build muscle', 'Lose body fat', 'Body recomposition', 'Improve overall fitness']
    },
    {
      title: 'Your body type',
      subtitle: 'Optional information for your profile.',
      key: 'bodyType',
      options: ['Slim', 'Average', 'Athletic', 'Higher body fat']
    },
    { title: 'About you', subtitle: 'Enter your basic information.', key: null },
    {
      title: 'Experience level',
      subtitle: 'Choose your current training experience.',
      key: 'experience',
      options: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
      title: 'Weekly schedule',
      subtitle: 'How many days can you train?',
      key: 'days',
      options: ['2 days', '3 days', '4 days', '5 days', '6 days']
    },
    {
      title: 'Training equipment',
      subtitle: 'Where do you usually train?',
      key: 'equipment',
      options: ['Gym', 'Home with equipment', 'Home without equipment']
    },
    {
      title: 'Muscle focus',
      subtitle: 'Choose the muscle groups you want to prioritize. You can change these any time in Edit Profile.',
      key: null
    }
  ];

  const personalizationScreen = () => {
    const current = steps[step];

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>BIFIT</Text>
          <TouchableOpacity onPress={() => setShowPersonalization(false)}>
            <Text style={styles.muted}>CLOSE ✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.eyebrow}>PERSONALIZATION</Text>
        <View style={styles.progressRow}>
          {steps.map((s, i) => (
            <View key={i} style={[
              styles.stepBar,
              { backgroundColor: i <= step ? GREEN : '#343A30' }
            ]} />
          ))}
        </View>

        <Text style={styles.muted}>STEP {step + 1} OF {steps.length}</Text>
        <Text style={styles.pageTitle}>{current.title}</Text>
        <Text style={styles.muted}>{current.subtitle}</Text>

        <View style={{ marginTop: 22 }}>
          {step === 6 ? (
            <View>
              <Text style={styles.cardTitle}>{language === 'hu' ? 'Izomcsoportok kiválasztása' : 'Select muscle groups'}</Text>
              <Text style={styles.muted}>{language === 'hu' ? 'Állíts be prioritást minden izomcsoporthoz. A Normal kiegyensúlyozott terhelést jelent.' : 'Set a priority for each group. Normal keeps a balanced focus.'}</Text>
              {['Chest','Back','Shoulders','Biceps','Triceps','Forearms','Abs','Glutes','Quadriceps','Hamstrings','Calves'].map(group => {
                const priority = muscleFocus[group] || 'Normal';
                return <View key={group} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: resolvedTheme === 'light' ? '#DCE4D7' : '#30352C' }}>
                  <Text style={styles.cardTitle}>{group}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 5 }}>
                    {['High','Medium','Normal'].map(level => <TouchableOpacity key={level} onPress={() => setMuscleFocus(prev => ({ ...prev, [group]: level }))} style={[styles.groupChip, { borderWidth: 1, borderColor: priority === level ? accentColor : 'transparent' }, priority === level && styles.groupChipActive]}>
                      <Text style={[styles.groupChipText, priority === level && { color: resolvedTheme === 'light' ? '#172116' : '#11150D' }]}>{language === 'hu' ? (level === 'High' ? 'Magas' : level === 'Medium' ? 'Közepes' : 'Normál') : (level === 'High' ? 'High priority' : level === 'Medium' ? 'Medium' : 'Normal')}</Text>
                    </TouchableOpacity>)}
                  </View>
                </View>;
              })}
            </View>
          ) : step === 2 ? (
            [['age', 'Age', 'years'], ['height', 'Height', 'cm'], ['weight', 'Weight', 'kg']].map(([key, label, unit]) => (
              <View key={key} style={{ marginBottom: 15 }}>
                <Text style={styles.cardTitle}>{label}</Text>
                <TextInput
                  value={answers[key]}
                  onChangeText={v => update(key, v.replace(/[^0-9.]/g, ''))}
                  keyboardType="numeric"
                  placeholder={`Enter ${unit}`}
                  placeholderTextColor={MUTED}
                  style={styles.input}
                />
              </View>
            ))
          ) : current.options.map(option => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                playSound('tap');
                update(current.key, option);
                if (current.key === 'days') { const n = parseInt(option, 10); setSelectedTrainingDays(p => { if (p.length === n) return p; if (p.length > n) return p.slice(0, n); const extra = Array.from({length:7},(_,j)=>j).filter(v=>!p.includes(v)).slice(0,n-p.length); return [...p,...extra].sort((a,b)=>a-b); }); }
              }}
              style={[
                styles.optionCard,
                answers[current.key] === option && styles.optionSelected
              ]}
            >
              <Text style={styles.optionText}>{option}</Text>
              <Text style={styles.green}>{answers[current.key] === option ? '✓' : '○'}</Text>
            </TouchableOpacity>
          ))}
          {step === 4 && (
            <View style={{ marginTop: 16 }}>
              <Text style={styles.cardTitle}>Choose your training weekdays</Text>
              <Text style={styles.muted}>Select exactly {Math.min(6, Math.max(2, parseInt(answers.days, 10) || 3))} days. These will be used in your weekly plan and calendar.</Text>
              <View style={styles.groupGrid}>
                {dayNames.map((day, index) => {
                  const active = selectedTrainingDays.includes(index);
                  const limit = Math.min(6, Math.max(2, parseInt(answers.days, 10) || 3));
                  return <TouchableOpacity key={day} style={[styles.groupChip, active && styles.groupChipActive]} onPress={() => setSelectedTrainingDays(p => active ? p.filter(x => x !== index) : (p.length < limit ? [...p, index].sort((a,b)=>a-b) : p))}>
                    <Text style={[styles.groupChipText, active && { color: BG }]}>{active ? '✓ ' : '+ '}{day}</Text>
                  </TouchableOpacity>;
                })}
              </View>
              <Text style={styles.green}>{selectedTrainingDays.length}/{Math.min(6, Math.max(2, parseInt(answers.days, 10) || 3))} selected</Text>
            </View>
          )}
        </View>

        {button(
          step === steps.length - 1 ? 'CREATE MY PROFILE →' : 'CONTINUE →',
          () => step < steps.length - 1 ? setStep(step + 1) : finishPersonalization()
        )}
        {step > 0 && button('← GO BACK', () => setStep(step - 1), true)}
      </ScrollView>
    );
  };

  const compatibleWithEquipment = e => {
    if (!profileComplete || answers.equipment === 'Gym') return true;
    if (answers.equipment === 'Home with equipment') {
      return e.equipment !== 'Gym';
    }
    return e.equipment === 'No equipment';
  };

  const experienceRank = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3
  };

  const workoutPlan = useMemo(() => {
    const splitSource = profileGender === 'female' ? womenWorkoutSplits : workoutSplits;
    const split = splitSource[dayCount] || splitSource[3];
    const rank = experienceRank[answers.experience] || 1;

    return split.map((day, index) => {
      let selected = activeExercises.filter(e => {
        const levelOkay = (experienceRank[e.level] || 1) <= rank;
        const equipmentOkay = !profileComplete || compatibleWithEquipment(e);
        const muscleOkay = day.muscles.some(m =>
          e.muscle.toLowerCase().includes(m.toLowerCase())
        );
        return levelOkay && equipmentOkay && muscleOkay;
      });

      if (selected.length < 4) {
        const extra = activeExercises.filter(e =>
          (experienceRank[e.level] || 1) <= rank &&
          (!profileComplete || compatibleWithEquipment(e)) &&
          !selected.some(s => s.id === e.id)
        );
        selected = [...selected, ...extra];
      }

      const priorityScore = exercise => {
        const tags = exerciseMuscleMetadata[exercise.name] || [exercise.muscle];
        return tags.reduce((score, tag) => {
          const normalized = String(tag).toLowerCase();
          const aliases = { legs: ['quadriceps','hamstrings','calves'], quads: ['quadriceps'], quadricep: ['quadriceps'], hamstring: ['hamstrings'], calf: ['calves'], core: ['abs'], abdominal: ['abs'], glute: ['glutes'], deltoids: ['shoulders'], pecs: ['chest'], lats: ['back'], forearm: ['forearms'] };
          const matched = Object.keys(muscleFocus).find(group => group.toLowerCase() === normalized || (aliases[normalized] || []).includes(group.toLowerCase()));
          const level = matched ? muscleFocus[matched] : 'Normal';
          return Math.max(score, level === 'High' ? 2 : level === 'Medium' ? 1 : 0);
        }, 0);
      };
      selected = selected.map((exercise, originalIndex) => ({ exercise, originalIndex }))
        .sort((a,b) => priorityScore(b.exercise) - priorityScore(a.exercise) || a.originalIndex - b.originalIndex)
        .map(item => item.exercise);

      return {
        ...day,
        dayName: dayNames[selectedTrainingDays[index] ?? index],
        weekdayIndex: selectedTrainingDays[index] ?? index,
        exercises: selected.slice(0, 6)
      };
    });
  }, [dayCount, answers.experience, answers.equipment, profileComplete, selectedTrainingDays, profileGender, muscleFocus]);

  const selectedPlan = workoutPlan.find(p => p.weekdayIndex === selectedWorkoutDay);
  const workoutExercises = selectedPlan ? selectedPlan.exercises : [];

  const completeWorkout = () => {
    if (!workoutExercises.length) {
      showAlert('No exercises completed', 'There is no scheduled workout to finish.');
      return;
    }
    if (completedExercises.length !== workoutExercises.length) {
      showAlert('Workout still in progress', `Complete all ${workoutExercises.length} scheduled exercises before finishing.`);
      return;
    }
    if (completedDates.includes(today)) {
      showAlert('Already completed', 'You have already recorded a workout today.');
      return;
    }

    const names = completedExercises
      .map(id => activeExercises.find(e => e.id === id)?.name)
      .filter(Boolean);

    setCompletedDates(p => [...new Set([...p, today])].sort());
    setWorkoutLogs(p => [...p, {
      date: today,
      exercises: completedExercises.length,
      names,
      workoutName: selectedPlan?.name || 'Workout'
    }]);
    setXp(p => p + 100 + completedExercises.length * 10);
    setWorkoutStarted(false);
    setCompletedExercises([]);
    playSound('success');
    showAlert('Workout completed! 🏆', 'You earned XP. Keep up the great work!');
  };

  const normalizeMuscleSearch = value => String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .trim();

  const muscleAliases = {
    calf: ['calf','calves','vádli','vádlik'], calves: ['calf','calves','vádli','vádlik'],
    vádli: ['calf','calves','vádli','vádlik'], vádlik: ['calf','calves','vádli','vádlik'], vadli: ['calf','calves','vádli','vádlik'],
    bicep: ['bicep','biceps','bicepsz'], biceps: ['bicep','biceps','bicepsz'], bicepsz: ['bicep','biceps','bicepsz'],
    chest: ['chest','mell','mellkas','pectorals'], mell: ['chest','mell','mellkas','pectorals'],
    back: ['back','hát','lat','lats'], hát: ['back','hát','lat','lats'], hat: ['back','hát','lat','lats'],
    shoulder: ['shoulder','shoulders','váll','deltoid'], shoulders: ['shoulder','shoulders','váll','deltoid'], vall: ['shoulder','shoulders','váll','deltoid'],
    legs: ['legs','leg','láb','comb','quadriceps','quads','hamstrings'], leg: ['legs','leg','láb','comb'],
    láb: ['legs','leg','láb','comb'], lab: ['legs','leg','láb','comb'], comb: ['legs','leg','láb','comb','quadriceps','hamstrings'],
    tricep: ['tricep','triceps','tricepsz'], triceps: ['tricep','triceps','tricepsz'], tricepsz: ['tricep','triceps','tricepsz'],
    glute: ['glute','glutes','farizom'], glutes: ['glute','glutes','farizom'], farizom: ['glute','glutes','farizom'],
    abs: ['abs','core','has','hasizom'], core: ['abs','core','has','hasizom'], has: ['abs','core','has','hasizom'], hasizom: ['abs','core','has','hasizom'],
    forearm: ['forearm','forearms','alkar'], forearms: ['forearm','forearms','alkar'],
    quadriceps: ['quadriceps','quads','combfeszito','comb'], quads: ['quadriceps','quads','combfeszito','comb'],
    hamstring: ['hamstring','hamstrings','combhajlito'], hamstrings: ['hamstring','hamstrings','combhajlito']
  };
  const query = normalizeMuscleSearch(search);
  const queryTerms = query.split(/\\s+/).filter(Boolean);
  const expandedTerms = queryTerms.flatMap(term => muscleAliases[term] || [term]).map(normalizeMuscleSearch);
  const filteredExercises = activeExercises.filter(e => {
    const name = normalizeMuscleSearch(e.name);
    const muscleFields = [
      e.muscle,
      ...(e.primaryMuscles || []),
      ...(e.secondaryMuscles || []),
      ...(e.muscleTags || [])
    ].map(normalizeMuscleSearch);
    const nameMatch = !query || name.includes(query);
    const muscleMatch = !!query && expandedTerms.some(term =>
      muscleFields.some(field => field.includes(term) || term.includes(field))
    );
    const category = normalizeMuscleSearch(muscleFilter);
    const categoryMatch = muscleFilter === 'All' || muscleFields.some(field =>
      field.includes(category) || (muscleAliases[category] || []).some(alias => field.includes(normalizeMuscleSearch(alias)))
    );
    return (!query || nameMatch || muscleMatch) && categoryMatch;
  });


  const normalizeFoodNutrition = (raw, source) => {
    const nutrients = raw.nutriments || {};
    const kcal = Number(
      nutrients['energy-kcal_100g'] ??
      nutrients['energy-kcal'] ??
      (Number(nutrients['energy_100g'] ?? nutrients.energy) / 4.184)
    );
    const protein = Number(nutrients.proteins_100g ?? nutrients.proteins ?? 0);
    const carbs = Number(nutrients.carbohydrates_100g ?? nutrients.carbohydrates ?? 0);
    const fat = Number(nutrients.fat_100g ?? nutrients.fat ?? 0);
    if (![kcal, protein, carbs, fat].every(Number.isFinite) || kcal < 0) return null;
    return {
      id: String(raw.code || raw.fdcId || `${source}-${raw.product_name || raw.description || Date.now()}`),
      name: raw.product_name || raw.product_name_en || raw.description || raw.name || 'Food item',
      brand: raw.brands || raw.brandOwner || '',
      source,
      calories100g: kcal,
      protein100g: protein,
      carbs100g: carbs,
      fat100g: fat,
      basis: '100 g',
      verified: true
    };
  };

  const searchFoodDatabase = async () => {
    const term = foodSearch.trim();
    if (!term) {
      setFoodDbError(language === 'hu' ? 'Írj be egy ételnevet a kereséshez.' : 'Enter a food name to search.');
      return;
    }
    setFoodDbLoading(true);
    setFoodDbError('');
    setSelectedDbFood(null);
    setFoodDbResults([]);
    const tasks = [];

    // Open Food Facts: broad branded/grocery catalogue, including products sold in Europe.
    tasks.push(
      fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(term)}&search_simple=1&action=process&json=1&page_size=20&fields=code,product_name,product_name_en,brands,nutriments`)
        .then(r => { if (!r.ok) throw new Error('Open Food Facts'); return r.json(); })
        .then(data => (data.products || []).map(p => normalizeFoodNutrition(p, 'Open Food Facts')).filter(Boolean))
        .catch(() => [])
    );

    // USDA FoodData Central: generic ingredients and prepared foods.
    // DEMO_KEY is intentionally used for prototyping; it has strict shared rate limits.
    tasks.push(
      fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query=${encodeURIComponent(term)}&pageSize=15`)
        .then(r => { if (!r.ok) throw new Error('USDA'); return r.json(); })
        .then(data => (data.foods || []).map(food => {
          const byId = {};
          (food.foodNutrients || []).forEach(n => {
            const id = String(n.nutrientNumber || n.nutrientId || '');
            byId[id] = Number(n.value ?? n.amount ?? 0);
          });
          const mapped = {
            fdcId: food.fdcId,
            description: food.description,
            brandOwner: food.brandOwner || '',
            nutriments: {
              'energy-kcal_100g': byId['1008'] || byId['2047'] || 0,
              proteins_100g: byId['1003'] || 0,
              carbohydrates_100g: byId['1005'] || 0,
              fat_100g: byId['1004'] || 0
            }
          };
          return normalizeFoodNutrition(mapped, 'USDA FoodData Central');
        }).filter(Boolean))
        .catch(() => [])
    );

    try {
      const results = await Promise.all(tasks);
      const merged = [...results[0], ...results[1]];
      const unique = [];
      const seen = new Set();
      merged.forEach(item => {
        const key = `${item.name.toLowerCase()}-${Math.round(item.calories100g)}-${item.source}`;
        if (!seen.has(key)) { seen.add(key); unique.push(item); }
      });
      setFoodDbResults(unique.slice(0, 30));
      if (!unique.length) {
        setFoodDbError(language === 'hu'
          ? 'Nem találtunk megfelelő ételt, vagy az adatbázisok átmenetileg nem elérhetők. Próbálj másik keresést, vagy add meg kézzel az adatokat.'
          : 'No matching foods found, or the databases are temporarily unavailable. Try another search or enter the values manually.');
      }
    } catch (e) {
      setFoodDbError(language === 'hu' ? 'Az ételkeresés most nem érhető el.' : 'Food search is temporarily unavailable.');
    } finally {
      setFoodDbLoading(false);
    }
  };

  const savePersonalMeal = () => {
    const name = mealForm.name.trim();
    const calories = Number(mealForm.calories);
    if (!name || mealForm.calories === '' || !Number.isFinite(calories) || calories < 0) {
      showAlert(language === 'hu' ? 'Hiányzó adatok' : 'Missing information', language === 'hu' ? 'Adj meg egy nevet és érvényes kalóriaértéket.' : 'Enter a meal name and a valid calorie amount.');
      return;
    }
    const meal = {
      id: `personal-${Date.now()}`,
      name,
      category: mealForm.category,
      calories: Math.round(calories),
      protein: Math.max(0, Number(mealForm.protein) || 0),
      carbs: Math.max(0, Number(mealForm.carbs) || 0),
      fat: Math.max(0, Number(mealForm.fat) || 0),
      createdAt: new Date().toISOString()
    };
    setSavedMeals(previous => [...previous, meal]);
    setMealForm({ name: '', category: 'Breakfast', calories: '', protein: '', carbs: '', fat: '' });
    playSound('success');
    showAlert(language === 'hu' ? 'Étkezés elmentve' : 'Meal saved', language === 'hu' ? 'Mostantól bármikor hozzáadhatod a naplódhoz.' : 'You can now add it to your diary whenever you want.');
  };

  const addPersonalMealToDiary = meal => {
    addMeal({ name: meal.name, category: meal.category, calories: meal.calories, protein: meal.protein, carbs: meal.carbs, fat: meal.fat, source: 'My Meals' });
  };

  const addDatabaseFoodToDiary = (saveForLater = false) => {
    if (!selectedDbFood) return;
    const grams = Number(foodPortionGrams);
    if (!Number.isFinite(grams) || grams <= 0 || grams > 5000) {
      showAlert(language === 'hu' ? 'Ellenőrizd az adagot' : 'Check the portion', language === 'hu' ? 'Adj meg 1 és 5000 gramm közötti mennyiséget.' : 'Enter a portion between 1 and 5000 grams.');
      return;
    }
    const factor = grams / 100;
    const meal = {
      name: selectedDbFood.name,
      brand: selectedDbFood.brand,
      grams,
      calories: Math.round(selectedDbFood.calories100g * factor),
      protein: Math.round(selectedDbFood.protein100g * factor * 10) / 10,
      carbs: Math.round(selectedDbFood.carbs100g * factor * 10) / 10,
      fat: Math.round(selectedDbFood.fat100g * factor * 10) / 10,
      source: selectedDbFood.source
    };
    if (saveForLater) {
      setSavedFoods(prev => prev.some(x => x.name === meal.name && x.source === meal.source) ? prev : [...prev, { ...meal, id: `${selectedDbFood.id}-${Date.now()}` }]);
    }
    addMeal(meal);
    setSelectedDbFood(null);
    setFoodPortionGrams('100');
  };

  const addMeal = meal => {
    setFoodEntries(p => [...p, {
      ...meal,
      id: String(Date.now()),
      date: today
    }]);
    setXp(p => p + 5);
    playSound('success');
    showAlert('Meal added', 'Your food diary has been updated. +5 XP');
  };

  const addCustomMeal = () => {
    if (!customFood.name.trim() || !customFood.calories || Number(customFood.calories) < 0) {
      showAlert('Missing information', 'Enter a food name and calorie amount.');
      return;
    }

    addMeal({
      name: customFood.name.trim(),
      calories: Number(customFood.calories),
      protein: Number(customFood.protein) || 0,
      carbs: Number(customFood.carbs) || 0,
      fat: Number(customFood.fat) || 0
    });

    setCustomFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  };

  const addWeight = () => {
    const value = Number(answers.weight);
    if (!value || value < 25 || value > 300) {
      showAlert('Invalid weight', 'Update your weight in your profile first.');
      return;
    }
    setWeightEntries(p => [...p, { date: today, weight: value }]);
    setXp(p => p + 10);
    playSound('success');
    showAlert('Weight saved', 'Your progress has been updated. +10 XP');
  };

  const saveStrengthLog = () => {
    const weight = Number(strengthForm.weight);
    const reps = Number(strengthForm.reps);
    const sets = Number(strengthForm.sets);

    if (!strengthForm.exercise.trim() || !Number.isFinite(weight) || weight < 0 || !reps || reps < 1 || !sets || sets < 1) {
      showAlert('Check your entry', 'Enter an exercise, weight, reps and sets.');
      return;
    }

    setStrengthLogs(p => [...p, {
      id: String(Date.now()),
      date: today,
      exercise: strengthForm.exercise.trim(),
      weight,
      reps,
      sets
    }]);
    setXp(p => p + 10);
    setStrengthFilter(strengthForm.exercise.trim());
    setStrengthForm(p => ({ ...p, weight: '', reps: '' }));
    playSound('success');
    showAlert('Strength record saved', 'Your strength progress has been updated. +10 XP');
  };

  const startRoutine = (groups, name) => {
    const routine = stretchLibrary.filter(s => groups.includes(s.group));
    if (!routine.length) return;

    setActiveRoutine(routine);
    setActiveRoutineName(name);
    setActiveStretchIndex(0);
    setSecondsLeft(routine[0].duration);
    setTimerRunning(false);
  };

  const customStretchRoutine = () => {
    if (!selectedGroups.length) {
      showAlert('Choose a muscle group', 'Select at least one group first.');
      return;
    }
    startRoutine(selectedGroups, 'My Custom Routine');
  };

  useEffect(() => {
    if (!timerRunning || !activeRoutine.length) return;

    const timer = setInterval(() => {
      setSecondsLeft(current => {
        if (current <= 1) {
          if (activeStretchIndex < activeRoutine.length - 1) {
            const nextIndex = activeStretchIndex + 1;
            setActiveStretchIndex(nextIndex);
            return activeRoutine[nextIndex].duration;
          }

          setTimerRunning(false);
          setStretchDone(p => [...p, {
            date: todayKey(),
            name: activeRoutineName,
            count: activeRoutine.length
          }]);
          setXp(p => p + 20);
          showAlert('Stretching completed! 🧘', 'Great work. You earned 20 XP.');
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerRunning, activeRoutine, activeStretchIndex, activeRoutineName]);

  const homeScreen = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.homeScrollContent}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>YOUR PERSONAL FITNESS PLATFORM</Text>
          <Text style={[styles.logo, styles.homeLogo]}>BIFIT</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => setTab('Profile')}>
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
      </View>

      {!profileChoiceLocked && card(
        <>
          <Text style={styles.cardTitle}>{language === 'hu' ? 'Válaszd ki a fitneszprofilodat' : 'Choose your fitness profile'}</Text>
          <Text style={styles.muted}>{language === 'hu' ? 'A választás személyre szabja a színeket és a számításokat.' : 'Your choice personalizes the theme and fitness calculations.'}</Text>
          <View style={styles.genderChoiceRow}>
            <TouchableOpacity onPress={() => chooseInitialProfile('male')} style={[styles.genderChoice, profileGender === 'male' && { borderColor: accentColor, backgroundColor: resolvedTheme === 'light' ? '#EAF3E5' : '#273322' }]}>
              <Text style={[styles.genderChoiceTitle, profileGender === 'male' && { color: accentColor }]}>{language === 'hu' ? 'Férfi profil' : "Men's Fitness"}</Text>
              <Text style={styles.muted}>{language === 'hu' ? 'Kiválasztás' : 'Select'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => chooseInitialProfile('female')} style={[styles.genderChoice, profileGender === 'female' && { borderColor: accentColor, backgroundColor: resolvedTheme === 'light' ? '#FCEAF1' : '#3A2630' }]}>
              <Text style={[styles.genderChoiceTitle, profileGender === 'female' && { color: accentColor }]}>{language === 'hu' ? 'Női profil' : "Women's Fitness"}</Text>
              <Text style={styles.muted}>{language === 'hu' ? 'Kiválasztás' : 'Select'}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Text style={styles.pageTitle}>Let's get stronger.</Text>
      <Text style={styles.muted}>
        {profileComplete ? `Your goal: ${answers.goal}` : 'Your journey starts here. 💪'}
      </Text>

      <View style={[styles.homeFeatureRow, isWideScreen && styles.homeFeatureRowWide]}>
        {!profileComplete && card(
          <>
            <Text style={styles.featureTitle}>Create your fitness profile</Text>
            <Text style={styles.muted}>Get a personalized experience.</Text>
            {button('PERSONALIZE MY PLAN →', startPersonalization)}
          </>,
          [styles.profileFeatureCard, isWideScreen && styles.desktopFeatureCard]
        )}

        <View style={[styles.hero, styles.homeFeatureCard, isWideScreen && styles.desktopFeatureCard]}>
          <Text style={styles.eyebrow}>YOUR FITNESS JOURNEY</Text>
          <Text style={styles.featureTitle}>Become your strongest self.</Text>
          <Text style={styles.heroDescription}>Small steps. Consistent progress.</Text>
          {button('START TRAINING →', () => setTab('Workout'))}
          <Text style={styles.heroDecoration}>BIFIT</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Stat styles={styles} icon="🔥" value={streak} label="Day streak" />
        <Stat styles={styles} icon="🏋️" value={workoutCount} label="Workouts" />
        <Stat styles={styles} icon="⭐" value={xp} label="Total XP" />
      </View>

      {heading('Your level', `LEVEL ${level}`)}
      {card(
        <>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>Level {level}</Text>
            <Text style={styles.green}>{levelProgress}/500 XP</Text>
          </View>
          {progress(levelProgress, 500)}
          <Text style={styles.muted}>{500 - levelProgress} XP until your next level.</Text>
        </>
      )}

      {heading("This week's activity", `${weeklyCount}/${dayCount} WORKOUTS`)}
      {card(
        <View style={styles.weekRow}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
            const d = new Date();
            d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + i);
            const done = completedDates.includes(dateKey(d));
            return (
              <View key={i} style={styles.weekDay}>
                <Text style={styles.muted}>{day}</Text>
                <View style={[styles.dayDot, done && styles.dayDotDone]}>
                  <Text style={[styles.dayDotText, done && { color: BG }]}>
                    {done ? '✓' : d.getDate()}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {heading('Daily hydration', `${water}/${goalWater} GLASSES`)}
      {card(
        <>
          <View style={styles.row}>
            <View style={{flexDirection:'row', alignItems:'center', gap:8}}><Text style={styles.cardTitle}>💧 Water intake</Text><TouchableOpacity style={styles.infoPill} onPress={() => setActiveInfo('water')}><Text style={styles.infoPillText}>ⓘ INFO</Text></TouchableOpacity></View>
            <Text style={styles.green}>{Math.round(water / goalWater * 100)}%</Text>
          </View>
          {progress(water, goalWater)}
          <View style={styles.row}>
            {button('−', () => setWater(Math.max(0, water - 1)), true)}
            {button('+ ADD GLASS', () => setWater(water + 1))}
          </View>
        </>
      )}

      {heading("Today's nutrition", `${Math.round(totals.calories)} KCAL`)}
      {card(
        <>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', gap:8}}><Text style={styles.cardTitle}>Daily calorie progress</Text><TouchableOpacity style={styles.infoPill} onPress={() => setActiveInfo('calories')}><Text style={styles.infoPillText}>ⓘ INFO</Text></TouchableOpacity></View>
          {progress(totals.calories, goalCalories)}
          <Text style={styles.muted}>{Math.max(0, goalCalories - totals.calories)} kcal remaining</Text>
          {button('OPEN NUTRITION →', () => setTab('Nutrition'))}
        </>
      )}

      {heading('Your weekly workout plan', 'PERSONALIZED')}
      {workoutPlan.map((day, i) => (
        <View key={day.name} style={styles.exercise}>
          <Text style={styles.exerciseEmoji}>📅</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{day.dayName} · {day.name}</Text>
            <Text style={styles.muted}>{day.exercises.length} recommended exercises</Text>
          </View>
        </View>
      ))}

      {card(<><Text style={styles.cardTitle}>Workout Calendar</Text><Text style={styles.muted}>View your monthly schedule and completed sessions.</Text>{button('OPEN CALENDAR →', () => setTab('Calendar'), true)}</>)}

      {heading('AI Assistant', 'COMING SOON')}
      <TouchableOpacity style={styles.coachCard} onPress={() => setTab('Coach')}>
        <Text style={styles.coachIcon}>✦</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>AI Assistant</Text>
          <Text style={styles.green}>COMING IN THE FUTURE</Text>
          <Text style={styles.muted}>An intelligent AI assistant is coming soon to BIFIT.</Text>
        </View>
        <Text style={styles.green}>→</Text>
      </TouchableOpacity>

      <View style={{ height: 25 }} />
    </ScrollView>
  );

  const workoutScreen = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>YOUR TRAINING</Text>
      <Text style={styles.pageTitle}>Workouts</Text>
      <Text style={styles.muted}>Build strength. Track progress. Improve every day.</Text>

      {card(
        <>
          <Text style={styles.eyebrow}>YOUR PERSONAL PLAN</Text>
          <Text style={styles.heroTitle}>{profileComplete ? answers.goal : 'Build your routine'}</Text>
          <Text style={styles.muted}>
            {profileComplete
              ? `${answers.experience} · ${answers.days} · ${answers.equipment}`
              : 'Complete your profile to personalize training.'}
          </Text>
          {!profileComplete && button('PERSONALIZE MY PLAN →', startPersonalization)}
        </>
      )}

      {heading('Your weekly schedule', `${dayCount} TRAINING DAYS`)}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dayNames.map((day, i) => {
          const plan = workoutPlan.find(p => p.weekdayIndex === i);
          return (
            <TouchableOpacity
              key={day}
              style={[styles.daySelector, selectedWorkoutDay === i && styles.daySelectorActive]}
              onPress={() => {
                setSelectedWorkoutDay(i);
                setWorkoutStarted(false);
                setCompletedExercises([]);
              }}
            >
              <Text style={[styles.daySelectorText, selectedWorkoutDay === i && { color: BG }]}>
                {day.slice(0, 3)}
              </Text>
              <Text style={[styles.daySelectorSub, selectedWorkoutDay === i && { color: BG }]}>
                {plan ? 'TRAIN' : 'REST'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedPlan ? card(
        <>
          <Text style={styles.eyebrow}>SCHEDULED WORKOUT</Text>
          <Text style={styles.heroTitle}>{selectedPlan.name}</Text>
          <Text style={styles.muted}>
            {selectedPlan.exercises.length} exercises · Based on your profile and equipment
          </Text>
          {selectedPlan.exercises.map(e => (
            <TouchableOpacity
              key={e.id}
              style={styles.exercise}
              onPress={() => setSelectedExercise(e)}
            >
              <Text style={styles.exerciseEmoji}>{e.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{e.name}</Text>
                <Text style={styles.muted}>{e.sets} sets · {e.reps} · {e.level}</Text>
              </View>
              <Text style={styles.green}>VIEW</Text>
            </TouchableOpacity>
          ))}
        </>
      ) : card(
        <>
          <Text style={styles.cardTitle}>Rest day 🌿</Text>
          <Text style={styles.muted}>Recovery is part of progress. Take a rest day or try a gentle stretching routine.</Text>
          {button('OPEN STRETCHING →', () => setTab('Stretching'))}
        </>
      )}

      {card(
        <>
          <Text style={styles.cardTitle}>Today's workout session</Text>
          <Text style={styles.muted}>
            {completedDates.includes(today)
              ? 'Workout completed today. Great job!'
              : 'Mark each exercise when you finish it.'}
          </Text>

          {!workoutStarted ? (
            button(
              'START WORKOUT SESSION →',
              () => {
                if (!selectedPlan) {
                  showAlert('Rest day', 'Choose a training day to start a workout.');
                  return;
                }
                setWorkoutStarted(true);
                setCompletedExercises([]);
              }
            )
          ) : (
            <>
              <Text style={styles.green}>SESSION IN PROGRESS</Text>
              <Text style={styles.muted}>{completedExercises.length} exercises completed</Text>
              {workoutExercises.map(e => (
                <TouchableOpacity
                  key={e.id}
                  style={styles.exercise}
                  onPress={() => {
                    playSound('tap');
                    setCompletedExercises(p =>
                      p.includes(e.id) ? p.filter(x => x !== e.id) : [...p, e.id]
                    );
                  }}
                >
                  <Text style={styles.exerciseCheck}>
                    {completedExercises.includes(e.id) ? '✓' : '○'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{e.name}</Text>
                    <Text style={styles.muted}>{e.sets} sets · {e.reps}</Text>
                  </View>
                  <Text style={styles.green}>INFO</Text>
                </TouchableOpacity>
              ))}
              {button('COMPLETE WORKOUT + XP', completeWorkout)}
              {button('CANCEL SESSION', () => {
                setWorkoutStarted(false);
                setCompletedExercises([]);
              }, true)}
            </>
          )}
        </>
      )}

      {heading('Exercise library', `${activeExercises.length} EXERCISES`)}
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder={language === 'hu' ? 'Gyakorlat vagy izom keresése...' : 'Search exercises...'}
        placeholderTextColor={MUTED}
        style={styles.input}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
        {['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio', 'Glutes', 'Calves'].map(m => (
          <TouchableOpacity
            key={m}
            onPress={() => setMuscleFilter(m)}
            style={[styles.chip, muscleFilter === m && styles.chipActive]}
          >
            <Text style={[styles.chipText, muscleFilter === m && { color: BG }]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredExercises.map(e => (
        <TouchableOpacity
          key={e.id}
          style={styles.exercise}
          onPress={() => {
            setSelectedExercise(e);
            setExpandedExerciseInfo(false);
          }}
        >
          <Text style={styles.exerciseEmoji}>{e.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{e.name}</Text>
            <Text style={styles.muted}>{e.muscle} · {e.sets} sets · {e.reps}</Text>
            <Text style={styles.green}>{e.level}</Text>
          </View>
          <Text style={styles.green}>VIEW →</Text>
        </TouchableOpacity>
      ))}

      {heading('Workout history', `${workoutLogs.length} SESSIONS`)}
      {workoutLogs.slice(-10).reverse().map((log, i) => (
        <View key={`${log.date}-${i}`} style={styles.exercise}>
          <Text style={styles.exerciseEmoji}>🏆</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{log.workoutName || 'Workout'} · {formatDate(log.date, language === 'hu' ? 'hu-HU' : 'en-US')}</Text>
            <Text style={styles.muted}>{log.exercises} exercises completed</Text>
          </View>
        </View>
      ))}
      <View style={{ height: 30 }} />
    </ScrollView>
  );

  const nutritionScreen = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>FUEL YOUR BODY</Text>
      <Text style={styles.pageTitle}>Nutrition</Text>
      <Text style={styles.muted}>Track your food and understand your daily intake.</Text>

      {card(
        <>
          <View style={styles.infoHeadingRow}>
            <Text style={styles.eyebrow}>DAILY CALORIES</Text>
            <TouchableOpacity style={styles.infoPill} onPress={() => setActiveInfo('calories')}>
              <Text style={styles.infoPillText}>ⓘ WHY THIS MATTERS</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bigNumber}>
            {Math.round(totals.calories)} <Text style={styles.muted}>/ {goalCalories} kcal</Text>
          </Text>
          {progress(totals.calories, goalCalories)}
          <Text style={styles.muted}>{Math.max(0, goalCalories - totals.calories)} kcal remaining</Text>
        </>
      )}

      {heading('Macronutrients', 'TODAY')}
      <View style={styles.macroRow}>
        <Macro styles={styles} label="Protein" value={totals.protein} goal={goalProtein} unit="g" />
        <Macro styles={styles} label="Carbs" value={totals.carbs} goal={goalCarbs} unit="g" />
        <Macro styles={styles} label="Fat" value={totals.fat} goal={goalFat} unit="g" />
      </View>

      {heading('Personalized daily targets', 'ESTIMATES')}
      {card(
        <>
          <Text style={styles.muted}>
            {profileComplete
              ? (profileGender === 'female' ? 'Female calorie estimate uses the female Mifflin–St Jeor equation.' : 'Male calorie estimate uses the male Mifflin–St Jeor equation.')
              : 'Complete your profile to calculate estimated calorie and macro targets.'}
          </Text>
          {[
            ['Calorie goal', goalCalories, setGoalCalories, 'kcal'],
            ['Protein goal', goalProtein, setGoalProtein, 'g'],
            ['Carbs goal', goalCarbs, setGoalCarbs, 'g'],
            ['Fat goal', goalFat, setGoalFat, 'g'],
            ['Water goal', goalWater, setGoalWater, 'glasses']
          ].map(([label, value, setter, unit]) => (
            <View key={label} style={styles.profileRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, flex: 1 }}>
                <Text style={styles.muted}>{label}</Text>
                {label === 'Calorie goal' && (
                  <TouchableOpacity onPress={() => setActiveInfo('calories')}><Text style={styles.green}>ⓘ</Text></TouchableOpacity>
                )}
                {label === 'Protein goal' && (
                  <TouchableOpacity onPress={() => setActiveInfo('protein')} hitSlop={8}><Text style={styles.green}>ⓘ</Text></TouchableOpacity>
                )}
                {label === 'Carbs goal' && (
                  <TouchableOpacity onPress={() => setActiveInfo('carbs')} hitSlop={8}><Text style={styles.green}>ⓘ</Text></TouchableOpacity>
                )}
                {label === 'Fat goal' && (
                  <TouchableOpacity onPress={() => setActiveInfo('fat')} hitSlop={8}><Text style={styles.green}>ⓘ</Text></TouchableOpacity>
                )}
                {label === 'Water goal' && (
                  <TouchableOpacity onPress={() => setActiveInfo('water')} hitSlop={8}><Text style={styles.green}>ⓘ</Text></TouchableOpacity>
                )}
              </View>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => setter(Math.max(1, value - (unit === 'kcal' ? 50 : 5)))}>
                  <Text style={styles.green}>−</Text>
                </TouchableOpacity>
                <Text style={styles.profileValue}>{value} {unit}</Text>
                <TouchableOpacity onPress={() => setter(value + (unit === 'kcal' ? 50 : 5))}>
                  <Text style={styles.green}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {profileComplete && button('RESET TO PROFILE ESTIMATES', () => {
            setGoalCalories(calculatedTargets.calories);
            setGoalProtein(calculatedTargets.protein);
            setGoalCarbs(calculatedTargets.carbs);
            setGoalFat(calculatedTargets.fat);
          }, true)}
        </>
      )}

      {heading(language === 'hu' ? 'Saját étkezéseim' : 'My Meals', language === 'hu' ? 'SAJÁT ÉTELGYŰJTEMÉNY' : 'YOUR PERSONAL COLLECTION')}
      {card(
        <>
          <Text style={styles.cardTitle}>{language === 'hu' ? 'Új étkezés létrehozása' : 'Create a new meal'}</Text>
          <Text style={styles.muted}>{language === 'hu' ? 'Mentsd el a gyakran fogyasztott étkezéseidet, és később egyetlen koppintással add hozzá a naplódhoz.' : 'Save meals you eat often and add them to your diary later with one tap.'}</Text>
          <TextInput value={mealForm.name} onChangeText={v => setMealForm(p => ({ ...p, name: v }))} placeholder={language === 'hu' ? 'Étkezés neve, pl. Csirkés rizs' : 'Meal name, e.g. Chicken and rice'} placeholderTextColor={MUTED} style={styles.input} />
          <Text style={styles.muted}>{language === 'hu' ? 'Kategória' : 'Category'}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
            {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(category => (
              <TouchableOpacity key={category} onPress={() => setMealForm(p => ({ ...p, category }))} style={[styles.chip, mealForm.category === category && styles.chipActive, { marginRight: 7, marginBottom: 7 }]}>
                <Text style={[styles.chipText, mealForm.category === category && { color: '#11150D' }]}>{language === 'hu' ? ({ Breakfast: 'Reggeli', Lunch: 'Ebéd', Dinner: 'Vacsora', Snacks: 'Snackek' }[category]) : category}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput value={mealForm.calories} onChangeText={v => setMealForm(p => ({ ...p, calories: v }))} placeholder={language === 'hu' ? 'Kalória (kcal) *' : 'Calories (kcal) *'} placeholderTextColor={MUTED} keyboardType="decimal-pad" style={[styles.input, { width: '100%', alignSelf: 'stretch' }]} />
          <TextInput value={mealForm.protein} onChangeText={v => setMealForm(p => ({ ...p, protein: v }))} placeholder={language === 'hu' ? 'Fehérje (g)' : 'Protein (g)'} placeholderTextColor={MUTED} keyboardType="decimal-pad" style={[styles.input, { width: '100%', alignSelf: 'stretch' }]} />
          <TextInput value={mealForm.carbs} onChangeText={v => setMealForm(p => ({ ...p, carbs: v }))} placeholder={language === 'hu' ? 'Szénhidrát (g)' : 'Carbs (g)'} placeholderTextColor={MUTED} keyboardType="decimal-pad" style={[styles.input, { width: '100%', alignSelf: 'stretch' }]} />
          <TextInput value={mealForm.fat} onChangeText={v => setMealForm(p => ({ ...p, fat: v }))} placeholder={language === 'hu' ? 'Zsír (g)' : 'Fat (g)'} placeholderTextColor={MUTED} keyboardType="decimal-pad" style={[styles.input, { width: '100%', alignSelf: 'stretch' }]} />
          {button(language === 'hu' ? 'ÉTKEZÉS MENTÉSE →' : 'SAVE MY MEAL →', savePersonalMeal)}
        </>
      )}
      {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(category => {
        const categoryMeals = savedMeals.filter(meal => meal.category === category);
        if (!categoryMeals.length) return null;
        return (
          <View key={category} style={{ marginBottom: 12 }}>
            <Text style={styles.cardTitle}>{language === 'hu' ? ({ Breakfast: 'Reggeli', Lunch: 'Ebéd', Dinner: 'Vacsora', Snacks: 'Snackek' }[category]) : category}</Text>
            {categoryMeals.map(meal => (
              <View key={meal.id} style={styles.exercise}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{meal.name}</Text>
                  <Text style={styles.muted}>{meal.calories} kcal · P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g</Text>
                </View>
                <TouchableOpacity style={styles.foodAddButton} onPress={() => addPersonalMealToDiary(meal)}><Text style={styles.foodAddText}>+ {language === 'hu' ? 'NAPLÓHOZ' : 'ADD TO DIARY'}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setSavedMeals(previous => previous.filter(item => item.id !== meal.id))} style={{ paddingLeft: 10 }}><Text style={styles.danger}>✕</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        );
      })}
      {savedMeals.length === 0 && <Text style={styles.muted}>{language === 'hu' ? 'Még nincs elmentett étkezésed. Hozd létre az elsőt fent!' : 'You have no saved meals yet. Create your first one above!'}</Text>}

      {heading('Snack & meal recommendations', 'PERSONALIZED IDEAS')}
      {card(
        <>
          <Text style={styles.cardTitle}>Your remaining targets</Text>
          <Text style={styles.muted}>
            {Math.max(0, goalCalories - totals.calories)} kcal remaining · {Math.max(0, goalProtein - totals.protein)} g protein remaining
          </Text>
          <Text style={styles.muted}>
            Suggestions are flexible ideas, not strict meal timing rules.
          </Text>
        </>
      )}

      {snackRecommendations.map((meal, i) => (
        <View key={i} style={styles.recommendationCard}>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>{meal.name}</Text>
            <Text style={styles.green}>{meal.calories} kcal</Text>
          </View>
          <Text style={styles.muted}>{meal.serving}</Text>
          <Text style={styles.muted}>
            P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g
          </Text>
          <Text style={styles.recommendationTiming}>WHEN: {meal.timing}</Text>
          <Text style={styles.muted}>{meal.reason}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.foodInfoButton} onPress={() => setSelectedFood(meal)}>
              <Text style={styles.green}>ⓘ FOOD INFO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.foodAddButton} onPress={() => addMeal(meal)}>
              <Text style={styles.foodAddText}>+ ADD TO DIARY</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}


      {heading(language === 'hu' ? 'Ételadatbázis kereső' : 'Food database search', language === 'hu' ? 'TÖBB MILLIÓ TERMÉK' : 'GLOBAL FOOD SEARCH')}
      <Text style={styles.muted}>
        {language === 'hu'
          ? 'Keress alapanyagokra, elkészített ételekre és bolti termékekre. Az értékek 100 grammra vonatkoznak, az adag alapján automatikusan számolunk.'
          : 'Search ingredients, prepared foods and branded grocery products. Values are per 100 g and are recalculated for your portion.'}
      </Text>
      <TextInput
        value={foodSearch}
        onChangeText={setFoodSearch}
        onSubmitEditing={searchFoodDatabase}
        placeholder={language === 'hu' ? 'Pl. csirkemell, rizs, joghurt...' : 'e.g. chicken breast, rice, yogurt...'}
        placeholderTextColor={MUTED}
        style={styles.input}
        returnKeyType="search"
      />
      {button(foodDbLoading ? (language === 'hu' ? 'KERESÉS...' : 'SEARCHING...') : (language === 'hu' ? 'ÉTEL KERESÉSE →' : 'SEARCH FOODS →'), searchFoodDatabase, foodDbLoading)}
      {foodDbError ? <Text style={styles.muted}>{foodDbError}</Text> : null}
      {foodDbResults.map((food, index) => (
        <TouchableOpacity
          key={`${food.id}-${index}`}
          onPress={() => { setSelectedDbFood(food); setFoodPortionGrams('100'); }}
          style={[styles.exercise, selectedDbFood && selectedDbFood.id === food.id ? styles.selectedExercise : null]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{food.name}</Text>
            <Text style={styles.muted}>{food.brand ? `${food.brand} · ` : ''}{food.source}</Text>
            <Text style={styles.muted}>
              {Math.round(food.calories100g)} kcal · P {food.protein100g.toFixed(1)}g · C {food.carbs100g.toFixed(1)}g · F {food.fat100g.toFixed(1)}g / 100g
            </Text>
          </View>
          <Text style={styles.green}>{selectedDbFood && selectedDbFood.id === food.id ? '✓' : '＋'}</Text>
        </TouchableOpacity>
      ))}
      {selectedDbFood && card(
        <>
          <Text style={styles.cardTitle}>{selectedDbFood.name}</Text>
          <Text style={styles.muted}>{language === 'hu' ? 'Mennyiség grammban' : 'Portion size in grams'}</Text>
          <TextInput
            value={foodPortionGrams}
            onChangeText={setFoodPortionGrams}
            keyboardType="numeric"
            placeholder="100"
            placeholderTextColor={MUTED}
            style={styles.input}
          />
          {(() => {
            const factor = Math.max(0, Number(foodPortionGrams) || 0) / 100;
            return (
              <Text style={styles.muted}>
                {Math.round(selectedDbFood.calories100g * factor)} kcal · P {(selectedDbFood.protein100g * factor).toFixed(1)}g · C {(selectedDbFood.carbs100g * factor).toFixed(1)}g · F {(selectedDbFood.fat100g * factor).toFixed(1)}g
              </Text>
            );
          })()}
          <View style={styles.row}>
            {button(language === 'hu' ? 'MENTÉS KEDVENCEKHEZ' : 'SAVE FOOD', () => addDatabaseFoodToDiary(true), true)}
            {button(language === 'hu' ? 'NAPLÓHOZ ADÁS' : 'ADD TO DIARY', () => addDatabaseFoodToDiary(false))}
          </View>
        </>
      )}
      {savedFoods.length > 0 && (
        <>
          <Text style={styles.cardTitle}>{language === 'hu' ? 'Mentett ételeim' : 'My saved foods'}</Text>
          {savedFoods.map(food => (
            <View key={food.id} style={styles.exercise}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{food.name}</Text>
                <Text style={styles.muted}>{food.grams || 100} g · {food.calories} kcal</Text>
              </View>
              <TouchableOpacity onPress={() => addMeal(food)}><Text style={styles.green}>+ ADD</Text></TouchableOpacity>
            </View>
          ))}
        </>
      )}

      {heading('Quick meal presets', 'QUICK ADD')}
      <TextInput
        value={foodSearch}
        onChangeText={setFoodSearch}
        placeholder={language === 'hu' ? 'Gyors ételek keresése...' : 'Search quick meals...'}
        placeholderTextColor={MUTED}
        style={styles.input}
      />
      {mealPresets.filter(m =>
        m.name.toLowerCase().includes(foodSearch.toLowerCase())
      ).map(m => (
        <View key={m.name} style={styles.exercise}>
          <Text style={styles.exerciseEmoji}>🥗</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{m.name}</Text>
            <Text style={styles.muted}>
              {m.calories} kcal · P {m.protein}g · C {m.carbs}g · F {m.fat}g
            </Text>
            <TouchableOpacity onPress={() => setSelectedFood(m)} style={{ paddingTop: 8 }}>
              <Text style={styles.green}>ⓘ VIEW FOOD INFORMATION</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => addMeal(m)}><Text style={styles.green}>+ ADD</Text></TouchableOpacity>
        </View>
      ))}


      {heading('Custom food', 'MANUAL ENTRY')}
      {card(
        <>
          {[
            ['name', 'Food name'],
            ['calories', 'Calories'],
            ['protein', 'Protein (g)'],
            ['carbs', 'Carbs (g)'],
            ['fat', 'Fat (g)']
          ].map(([key, label]) => (
            <TextInput
              key={key}
              value={customFood[key]}
              onChangeText={v => setCustomFood(p => ({ ...p, [key]: v }))}
              placeholder={label}
              placeholderTextColor={MUTED}
              keyboardType={key === 'name' ? 'default' : 'numeric'}
              style={styles.input}
            />
          ))}
          {button('ADD CUSTOM FOOD →', addCustomMeal)}
        </>
      )}

      {heading("Today's food diary", `${todayFood.length} ITEMS`)}
      {todayFood.length === 0 && <Text style={styles.muted}>No meals added yet.</Text>}
      {todayFood.map(f => (
        <View key={f.id} style={styles.exercise}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{f.name}</Text>
            <Text style={styles.muted}>
              {f.grams ? `${f.grams} g · ` : ''}{f.calories} kcal · P {f.protein}g · C {f.carbs}g · F {f.fat}g
            </Text>
            <TouchableOpacity onPress={() => setSelectedFood(f)} style={{ paddingTop: 6 }}><Text style={styles.green}>ⓘ FOOD INFO</Text></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setFoodEntries(p => p.filter(x => x.id !== f.id))}>
            <Text style={styles.danger}>REMOVE</Text>
          </TouchableOpacity>
        </View>
      ))}

      {heading('Hydration', 'DAILY TRACKER')}
      {card(
        <>
          <View style={styles.infoHeadingRow}>
            <Text style={styles.cardTitle}>Daily water intake</Text>
            <TouchableOpacity style={styles.infoPill} onPress={() => setActiveInfo('water')}>
              <Text style={styles.infoPillText}>ⓘ WHY IT MATTERS</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bigNumber}>💧 {water}/{goalWater} glasses</Text>
          {progress(water, goalWater)}
          <View style={styles.row}>
            {button('−', () => setWater(Math.max(0, water - 1)), true)}
            {button('+ ADD WATER', () => setWater(water + 1))}
          </View>
        </>
      )}
      <View style={{ height: 30 }} />
    </ScrollView>
  );

  const stretchingScreen = () => {
    const currentStretch = activeRoutine[activeStretchIndex];

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>RECOVERY & MOBILITY</Text>
        <Text style={styles.pageTitle}>Stretching</Text>
        <Text style={styles.muted}>Build mobility, recover and move comfortably.</Text>

        {heading('Ready-made routines', 'CHOOSE A ROUTINE')}
        {routinePresets.map(r => (
          <TouchableOpacity
            key={r.name}
            style={styles.exercise}
            onPress={() => startRoutine(r.groups, r.name)}
          >
            <Text style={styles.exerciseEmoji}>🧘</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{r.name}</Text>
              <Text style={styles.muted}>{r.groups.length} muscle groups</Text>
            </View>
            <Text style={styles.green}>START →</Text>
          </TouchableOpacity>
        ))}

        {heading('Build your own routine', 'MULTIPLE SELECTION')}
        {card(
          <>
            <Text style={styles.cardTitle}>Choose muscle groups</Text>
            <View style={styles.groupGrid}>
              {stretchGroups.map(group => {
                const selected = selectedGroups.includes(group);
                return (
                  <TouchableOpacity
                    key={group}
                    style={[styles.groupChip, selected && styles.groupChipActive]}
                    onPress={() => setSelectedGroups(p =>
                      selected ? p.filter(x => x !== group) : [...p, group]
                    )}
                  >
                    <Text style={[styles.groupChipText, selected && { color: BG }]}>
                      {selected ? '✓ ' : '+ '}{group}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {button('CREATE MY STRETCHING ROUTINE →', customStretchRoutine)}
          </>
        )}

        {activeRoutine.length > 0 && (
          <>
            {heading(activeRoutineName, `${activeRoutine.length} MOVEMENTS`)}
            {card(
              <>
                <Text style={styles.eyebrow}>STRETCHING TIMER</Text>
                <Text style={styles.timerNumber}>
                  {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}
                </Text>
                <Text style={styles.cardTitle}>
                  {currentStretch ? currentStretch.name : 'Routine completed'}
                </Text>
                <Text style={styles.muted}>
                  {currentStretch ? `${currentStretch.group} · ${currentStretch.type}` : 'Great work!'}
                </Text>
                <View style={styles.row}>
                  {button(
                    timerRunning ? 'PAUSE TIMER' : 'START TIMER',
                    () => setTimerRunning(p => !p)
                  )}
                  {button('RESET', () => {
                    setTimerRunning(false);
                    setActiveStretchIndex(0);
                    setSecondsLeft(activeRoutine[0].duration);
                  }, true)}
                </View>
                {currentStretch && (
                  <>
                    <Text style={styles.muted}>
                      {secondsLeft <= currentStretch.duration / 2
                        ? 'Switch sides if this movement uses both sides.'
                        : 'Keep the movement gentle and controlled.'}
                    </Text>
                    <View style={styles.dividerLine} />
                    <Text style={styles.cardTitle}>How to perform</Text>
                    <Text style={styles.muted}>{currentStretch.steps}</Text>
                    <Text style={styles.cardTitle}>Breathing</Text>
                    <Text style={styles.muted}>{currentStretch.breathing}</Text>
                    <Text style={styles.cardTitle}>Benefits</Text>
                    <Text style={styles.muted}>{currentStretch.benefit}</Text>
                    <Text style={styles.cardTitle}>Common mistakes</Text>
                    <Text style={styles.muted}>{currentStretch.mistakes}</Text>
                  </>
                )}
              </>
            )}
            {activeRoutine.map((s, i) => (
              <View key={s.id} style={styles.exercise}>
                <Text style={styles.exerciseEmoji}>{i < activeStretchIndex ? '✓' : '🧘'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{s.name}</Text>
                  <Text style={styles.muted}>{s.group} · {s.duration} sec · {s.type}</Text>
                </View>
                {i === activeStretchIndex && <Text style={styles.green}>NOW</Text>}
              </View>
            ))}
          </>
        )}

        {heading('Stretching history', `${stretchDone.length} COMPLETIONS`)}
        {stretchDone.slice(-10).reverse().map((s, i) => (
          <View key={`${s.date}-${i}`} style={styles.exercise}>
            <Text style={styles.exerciseEmoji}>✅</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{s.name}</Text>
              <Text style={styles.muted}>{formatDate(s.date, language === 'hu' ? 'hu-HU' : 'en-US')} · {s.count} movements</Text>
            </View>
          </View>
        ))}
        {stretchDone.length === 0 && (
          <Text style={styles.muted}>Your completed routines will appear here.</Text>
        )}
        <Text style={styles.smallNote}>
          Stretch gently. You should feel mild tension, not pain. Before workouts, use dynamic warm-ups rather than long static holds.
        </Text>
        <View style={{ height: 30 }} />
      </ScrollView>
    );
  };

  const progressScreen = () => {
    const recentWeights = weightEntries.slice(-7);
    const maxWeight = Math.max(...recentWeights.map(e => Number(e.weight)), 1);
    const selectedStrengthLogs = strengthLogs
      .filter(e => e.exercise.toLowerCase() === strengthFilter.toLowerCase())
      .slice(-6);
    const maxStrength = Math.max(...selectedStrengthLogs.map(e => Number(e.weight)), 1);

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>YOUR JOURNEY</Text>
        <Text style={styles.pageTitle}>Progress</Text>
        <Text style={styles.muted}>See how far you've come.</Text>

        <View style={styles.statsRow}>
          <Stat styles={styles} icon="🏋️" value={workoutCount} label="Workouts" />
          <Stat styles={styles} icon="🔥" value={streak} label="Streak" />
          <Stat styles={styles} icon="⭐" value={level} label="Level" />
        </View>

        {heading('Workout activity', 'LAST 7 DAYS')}
        {card(
          <View style={styles.chart}>
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              const done = completedDates.includes(dateKey(d));
              return (
                <View key={i} style={styles.chartColumn}>
                  <View style={[
                    styles.chartBar,
                    { height: done ? 105 : 12, backgroundColor: done ? GREEN : '#343A30' }
                  ]} />
                  <Text style={styles.muted}>
                    {d.toLocaleDateString(language === 'hu' ? 'hu-HU' : 'en-US', { weekday: 'short' }).slice(0, 1)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {heading('Weight progress', 'LAST 7 RECORDS')}
        {card(
          <>
            <Text style={styles.bigNumber}>
              {answers.weight || '--'} <Text style={styles.muted}>kg current profile weight</Text>
            </Text>
            {button('SAVE CURRENT WEIGHT', addWeight)}
            {recentWeights.length > 0 && (
              <View style={styles.chart}>
                {recentWeights.map((e, i) => (
                  <View key={`${e.date}-${i}`} style={styles.chartColumn}>
                    <Text style={styles.miniChartValue}>{e.weight}</Text>
                    <View style={[
                      styles.chartBar,
                      { height: Math.max(12, Number(e.weight) / maxWeight * 85) }
                    ]} />
                    <Text style={styles.muted}>{formatDate(e.date, language === 'hu' ? 'hu-HU' : 'en-US')}</Text>
                  </View>
                ))}
              </View>
            )}
            {weightEntries.slice(-10).reverse().map((e, i) => (
              <View key={`${e.date}-${i}`} style={styles.profileRow}>
                <Text style={styles.muted}>{formatDate(e.date, language === 'hu' ? 'hu-HU' : 'en-US')}</Text>
                <Text style={styles.profileValue}>{e.weight} kg</Text>
              </View>
            ))}
            {weightEntries.length === 0 && (
              <Text style={styles.muted}>Your weight history will appear here.</Text>
            )}
          </>
        )}

        {heading('Strength tracking', 'EXERCISE RECORDS')}
        {card(
          <>
            <Text style={styles.cardTitle}>Log your strength progress</Text>
            <TextInput
              value={strengthForm.exercise}
              onChangeText={v => setStrengthForm(p => ({ ...p, exercise: v }))}
              placeholder="Exercise name"
              placeholderTextColor={MUTED}
              style={styles.input}
            />
            <TextInput
              value={strengthForm.weight}
              onChangeText={v => setStrengthForm(p => ({ ...p, weight: v }))}
              placeholder="Weight (kg)"
              placeholderTextColor={MUTED}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.row}>
              <TextInput
                value={strengthForm.reps}
                onChangeText={v => setStrengthForm(p => ({ ...p, reps: v }))}
                placeholder="Reps"
                placeholderTextColor={MUTED}
                keyboardType="numeric"
                style={[styles.input, { flex: 1 }]}
              />
              <TextInput
                value={strengthForm.sets}
                onChangeText={v => setStrengthForm(p => ({ ...p, sets: v }))}
                placeholder="Sets"
                placeholderTextColor={MUTED}
                keyboardType="numeric"
                style={[styles.input, { flex: 1 }]}
              />
            </View>
            {button('SAVE STRENGTH RECORD', saveStrengthLog)}
          </>
        )}

        {card(
          <>
            <Text style={styles.cardTitle}>Choose exercise to view</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {activeExercises.slice(0, 15).map(e => (
                <TouchableOpacity
                  key={e.id}
                  style={[styles.chip, strengthFilter === e.name && styles.chipActive]}
                  onPress={() => setStrengthFilter(e.name)}
                >
                  <Text style={[styles.chipText, strengthFilter === e.name && { color: BG }]}>
                    {e.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.cardTitle}>{strengthFilter}</Text>
            {selectedStrengthLogs.length > 0 ? (
              <>
                <View style={styles.chart}>
                  {selectedStrengthLogs.map((e, i) => (
                    <View key={e.id} style={styles.chartColumn}>
                      <Text style={styles.miniChartValue}>{e.weight} kg</Text>
                      <View style={[
                        styles.chartBar,
                        { height: Math.max(12, Number(e.weight) / maxStrength * 85) }
                      ]} />
                      <Text style={styles.muted}>{formatDate(e.date, language === 'hu' ? 'hu-HU' : 'en-US')}</Text>
                    </View>
                  ))}
                </View>
                {selectedStrengthLogs.slice().reverse().map(e => (
                  <View key={e.id} style={styles.profileRow}>
                    <Text style={styles.muted}>{formatDate(e.date, language === 'hu' ? 'hu-HU' : 'en-US')}</Text>
                    <Text style={styles.profileValue}>
                      {e.weight} kg · {e.sets} × {e.reps}
                    </Text>
                  </View>
                ))}
              </>
            ) : (
              <Text style={styles.muted}>No strength records for this exercise yet.</Text>
            )}
          </>
        )}

        {heading('Stretching progress', `${stretchDone.length} ROUTINES`)}
        {card(
          <>
            <Text style={styles.bigNumber}>{stretchDone.length}</Text>
            <Text style={styles.muted}>Completed stretching routines</Text>
            {button('OPEN STRETCHING →', () => setTab('Stretching'))}
          </>
        )}

        {heading('Training achievements', `${unlocked}/${achievements.length} UNLOCKED`)}
        {achievements.map(a => {
          const done = a.target ? workoutCount >= a.target : streak >= a.streak;
          return (
            <View key={a.id} style={[styles.achievement, !done && { opacity: 0.45 }]}>
              <Text style={styles.achievementIcon}>{done ? a.icon : '🔒'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{a.name}</Text>
                <Text style={styles.muted}>{a.description}</Text>
              </View>
              <Text style={styles.green}>{done ? 'UNLOCKED' : 'LOCKED'}</Text>
            </View>
          );
        })}
        <View style={{ height: 30 }} />
      </ScrollView>
    );
  };


  const calendarScreen = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [...Array(offset).fill(null), ...Array.from({length: daysInMonth}, (_,i)=>i+1)];
    while (cells.length % 7) cells.push(null);
    const selected = new Date(calendarSelectedDate + 'T12:00:00');
    const selectedWeekday = (selected.getDay() + 6) % 7;
    const plan = workoutPlan.find(p => p.weekdayIndex === selectedWeekday);
    const done = completedDates.includes(calendarSelectedDate);
    const isPast = calendarSelectedDate < today;
    const planned = !!plan;
    const log = workoutLogs.find(x => x.date === calendarSelectedDate);
    const monthLabel = calendarMonth.toLocaleDateString(language === 'hu' ? 'hu-HU' : 'en-US', {month:'long', year:'numeric'});
    return <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>BIFIT · TRAINING OVERVIEW</Text>
      <Text style={styles.pageTitle}>{language === 'hu' ? 'Edzésnaptár' : 'Workout Calendar'}</Text>
      <Text style={styles.muted}>{language === 'hu' ? 'Tervezd meg és kövesd az edzéseidet.' : 'Plan and track your training days.'}</Text>
      {card(<>
        <View style={styles.row}>
          <TouchableOpacity onPress={()=>setCalendarMonth(new Date(year,month-1,1))}><Text style={styles.green}>‹ {language==='hu'?'ELŐZŐ':'PREV'}</Text></TouchableOpacity>
          <Text style={styles.cardTitle}>{monthLabel}</Text>
          <TouchableOpacity onPress={()=>setCalendarMonth(new Date(year,month+1,1))}><Text style={styles.green}>{language==='hu'?'KÖVETKEZŐ':'NEXT'} ›</Text></TouchableOpacity>
        </View>
        <View style={styles.calendarGrid}>{(language==='hu'?['H','K','Sze','Cs','P','Szo','V']:['M','T','W','T','F','S','S']).map((d,i)=><Text key={i} style={[styles.calendarCellText,styles.calendarWeekLabel]}>{d}</Text>)}
          {cells.map((day,i)=>{
            if(!day) return <View key={'blank'+i} style={styles.calendarCell}/>;
            const date = new Date(year,month,day); const key=dateKey(date); const weekday=(date.getDay()+6)%7;
            const isDone=completedDates.includes(key); const isPlan=selectedTrainingDays.includes(weekday); const isToday=key===today; const isSelected=key===calendarSelectedDate; const isCellPast=key<today;
            return <TouchableOpacity key={key} style={[styles.calendarCell,isSelected&&styles.calendarCellSelected,isToday&&styles.calendarCellToday]} onPress={()=>setCalendarSelectedDate(key)}>
              <Text style={[styles.calendarCellText,isSelected&&{color:BG}]}>{day}</Text>
              <View style={[styles.calendarDot,isDone?styles.calendarDone:isPlan?styles.calendarPlanned:isCellPast?styles.calendarMissed:null]}/>
            </TouchableOpacity>;
          })}
        </View>
        <View style={styles.calendarLegend}>
          <View style={styles.calendarLegendItem}><View style={[styles.calendarLegendDot, styles.calendarDone]} /><Text style={styles.muted}>{language==='hu'?'Teljesítve':'Completed'}</Text></View>
          <View style={styles.calendarLegendItem}><View style={[styles.calendarLegendDot, styles.calendarPlanned]} /><Text style={styles.muted}>{language==='hu'?'Tervezett':'Scheduled'}</Text></View>
          <View style={styles.calendarLegendItem}><View style={[styles.calendarLegendDot, styles.calendarMissed]} /><Text style={styles.muted}>{language==='hu'?'Kihagyott':'Missed'}</Text></View>
        </View>
      </>)}
      {heading(language==='hu'?'Kiválasztott nap':'Selected day', formatDate(calendarSelectedDate, language === 'hu' ? 'hu-HU' : 'en-US'))}
      {card(<>
        <Text style={styles.cardTitle}>{selected.toLocaleDateString(language==='hu'?'hu-HU':'en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</Text>
        <Text style={[styles.green,{marginVertical:6}]}>{done?(language==='hu'?'✓ TELJESÍTVE':'✓ COMPLETED'):planned?(isPast?(language==='hu'?'KIHAGYOTT EDZÉS':'MISSED WORKOUT'):(language==='hu'?'TERVEZETT EDZÉS':'SCHEDULED WORKOUT')):(language==='hu'?'PIHENŐNAP':'REST DAY')}</Text>
        {planned ? <><Text style={styles.cardTitle}>{plan?.name}</Text><Text style={styles.muted}>{plan?.muscles.join(' · ')}</Text>{plan?.exercises.map(e=><Text key={e.id} style={styles.instructionLine}>• {e.name} · {e.sets} × {e.reps}</Text>)}</> : <Text style={styles.muted}>{language==='hu'?'Erre a napra nincs edzés beütemezve. A pihenés is fontos!':'No workout is scheduled for this day. Recovery matters!'}</Text>}
        {log && <><View style={styles.dividerLine}/><Text style={styles.cardTitle}>{language==='hu'?'Elvégzett edzés':'Recorded workout'}: {log.workoutName || 'Workout'}</Text><Text style={styles.muted}>{log.exercises} {language==='hu'?'gyakorlat':'exercises'}</Text>{(log.names||[]).map((n,i)=><Text key={i} style={styles.instructionLine}>• {n}</Text>)}</>}
        {planned && !done && !isPast && button(language==='hu'?'EDZÉS MEGNYITÁSA':'OPEN WORKOUT',()=>{setSelectedWorkoutDay(selectedWeekday);setTab('Workout');})}
      </>)}
      {heading(language==='hu'?'Heti összesítés':'Weekly overview', `${weeklyCount}/${dayCount}`)}
      {card(<><Text style={styles.cardTitle}>{language==='hu'?'Teljesített edzések ezen a héten':'Workouts completed this week'}</Text>{progress(weeklyCount,dayCount)}<Text style={styles.muted}>{Math.max(0,dayCount-weeklyCount)} {language==='hu'?'edzés van hátra':'workouts remaining'}</Text></>)}
      <View style={{height:30}}/>
    </ScrollView>;
  };

  const coachScreen = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.comingSoonContainer}
    >
      <View style={styles.comingSoonContent}>
        <Text style={styles.comingSoonIcon}>✦</Text>
        <Text style={styles.eyebrow}>BIFIT AI EXPERIENCE</Text>
        <Text style={styles.comingSoonTitle}>AI COACH</Text>
        <Text style={styles.comingSoonHeading}>Coming Soon!</Text>
        <Text style={styles.comingSoonDescription}>
          We're working on something great! Your AI Coach is currently
          training very hard. Thanks for your patience — we can't wait
          to show you what's coming! 💪
        </Text>
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonBadgeText}>✦ UNDER DEVELOPMENT</Text>
        </View>
      </View>
    </ScrollView>
  );

  const profileScreen = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>YOUR ACCOUNT</Text>
      <Text style={styles.pageTitle}>Profile</Text>

      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => { playSound('tap'); setTab('Settings'); }}
        style={{ backgroundColor: accentColor, borderRadius: 13, paddingVertical: 17, paddingHorizontal: 18, marginBottom: 16, alignItems: 'center' }}
      >
        <Text style={{ color: '#11150D', fontSize: 13, fontWeight: '900', letterSpacing: 1 }}>
          ⚙ {language === 'hu' ? 'BEÁLLÍTÁSOK MEGNYITÁSA' : 'OPEN SETTINGS'} →
        </Text>
      </TouchableOpacity>

      {card(
        <>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <Text style={[styles.cardTitle, { marginTop: 14 }]}>Your fitness profile</Text>
          <Text style={styles.muted}>
            {profileComplete
              ? 'Your personal information and goals.'
              : 'Complete your profile to personalize your experience.'}
          </Text>
          {button(profileComplete ? 'EDIT PROFILE' : 'SET UP MY PROFILE', startPersonalization)}
        </>
      )}

      {profileComplete && card(
        <>
          {[
            ['Profile', profileGender === 'female' ? (language === 'hu' ? 'Női' : 'Women') : (language === 'hu' ? 'Férfi' : 'Men')],
            ['Goal', answers.goal],
            ['Body type', answers.bodyType],
            ['Age', answers.age + ' years'],
            ['Height', answers.height + ' cm'],
            ['Weight', answers.weight + ' kg'],
            ['Experience', answers.experience],
            ['Training days', answers.days],
            ['Training weekdays', selectedTrainingDays.map(i => dayNames[i]).join(', ')],
            ['Equipment', answers.equipment],
            [language === 'hu' ? 'Izomfókusz' : 'Muscle focus', Object.entries(muscleFocus).filter(([,v]) => v !== 'Normal').map(([k,v]) => `${k} (${v})`).join(', ') || (language === 'hu' ? 'Kiegyensúlyozott' : 'Balanced')]
          ].map(([k, v]) => (
            <View key={k} style={styles.profileRow}>
              <Text style={styles.muted}>{k}</Text>
              <Text style={styles.profileValue}>{v}</Text>
            </View>
          ))}
        </>
      )}

      {heading('Your account level', `LEVEL ${level}`)}
      {card(
        <>
          <Text style={styles.bigNumber}>⭐ {xp} XP</Text>
          {progress(levelProgress, 500)}
          <Text style={styles.muted}>{500 - levelProgress} XP until level {level + 1}</Text>
        </>
      )}

      {heading('Settings', 'APP')}
      {card(
        <>
          <Text style={styles.cardTitle}>BIFIT</Text>
          <Text style={styles.muted}>Version 2.2 · Your personal fitness platform.</Text>
          <Text style={[styles.cardTitle,{marginTop:16}]}>{language==='hu'?'Alkalmazás nyelve':'App language'}</Text>
          <View style={styles.row}>
            {button('🇬🇧 English',()=>setLanguage('en'),language!=='en')}
            {button('🇭🇺 Magyar',()=>setLanguage('hu'),language!=='hu')}
          </View>
          <Text style={[styles.cardTitle,{marginTop:16}]}>{language==='hu'?'Fitneszprofil váltása':'Change fitness profile'}</Text>
          <Text style={styles.muted}>{language==='hu'?'A másik profilhoz külön személyes adatokat és edzéstervet állíthatsz be. A korábban mentett profilod megmarad.':'Each profile keeps its own personal details and plan. Previously saved profile data will be restored when you switch back.'}</Text>
          <View style={styles.genderChoiceRow}>
            <TouchableOpacity onPress={() => switchFitnessProfile('male')} style={[styles.genderChoice, profileGender==='male' && {borderColor:GREEN, backgroundColor:resolvedTheme === 'light' ? '#EAF3E5' : '#273322'}]}>
              <Text style={[styles.genderChoiceTitle, profileGender==='male' && {color:GREEN}]}>{language==='hu'?'Férfi profil':'Men’s Fitness'}</Text>
              <Text style={styles.muted}>{profileGender==='male'?(language==='hu'?'Aktív':'Active'):(genderProfiles.male?.profileComplete?(language==='hu'?'Mentett profil':'Saved profile'):(language==='hu'?'Új profil':'New profile'))}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => switchFitnessProfile('female')} style={[styles.genderChoice, profileGender==='female' && {borderColor:'#F28AB2', backgroundColor:resolvedTheme === 'light' ? '#FCEAF1' : '#3A2630'}]}>
              <Text style={[styles.genderChoiceTitle, profileGender==='female' && {color:'#F28AB2'}]}>{language==='hu'?'Női profil':'Women’s Fitness'}</Text>
              <Text style={styles.muted}>{profileGender==='female'?(language==='hu'?'Aktív':'Active'):(genderProfiles.female?.profileComplete?(language==='hu'?'Mentett profil':'Saved profile'):(language==='hu'?'Új profil':'New profile'))}</Text>
            </TouchableOpacity>
          </View>
          {button('VIEW MY PROGRESS →', () => setTab('Progress'), true)}
          {button('OPEN AI COACH →', () => setTab('Coach'))}
        </>
      )}

      {button('RESET APP DATA', () => {
        showAlert(
          'Reset all data?',
          'This removes your profile, workouts, food diary and progress.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Reset',
              style: 'destructive',
              onPress: async () => {
                await AsyncStorage.removeItem(STORAGE_KEY);
                setAnswers(defaultAnswers);
                setMuscleFocus({});
                setProfileGender('male');
                setProfileChoiceLocked(false);
                setGenderProfiles({});
                setProfileComplete(false);
                setProfileXpAwarded(false);
                setCompletedDates([]);
                setWater(0);
                setWeightEntries([]);
                setXp(0);
                setWorkoutLogs([]);
                setFoodEntries([]);
                setStrengthLogs([]);
                setStretchDone([]);
                setSelectedTrainingDays([0, 2, 4]);
                setGoalCalories(2400);
                setGoalProtein(150);
                setGoalWater(8);
                setGlassSizeMl(250);
                setGlassSizeInput('250');
                setThemeMode('dark');
                setGoalCarbs(250);
                setGoalFat(70);
                setWorkoutStarted(false);
                setCompletedExercises([]);
                setShowPersonalization(false);
                setSelectedExercise(null);
                setTab('Home');
                playSound('success');
              }
            }
          ]
        );
      }, true)}
      <View style={{ height: 30 }} />
    </ScrollView>
  );

  const applyGlassSize = () => {
    const parsed = Math.round(Number(String(glassSizeInput).replace(',', '.')));
    if (!Number.isFinite(parsed) || parsed < 225 || parsed > 5000) {
      showAlert(language === 'hu' ? 'Érvénytelen pohárméret' : 'Invalid glass size', language === 'hu' ? 'A pohár mérete 225 és 5000 ml között lehet.' : 'Glass size must be between 225 and 5000 ml.');
      setGlassSizeInput(String(glassSizeMl));
      return;
    }
    setGlassSizeMl(parsed);
    setGoalWater(Math.max(1, Math.ceil(2000 / parsed)));
    setGlassSizeInput(String(parsed));
    playSound('success');
  };

  const settingsScreen = () => {
    const isHu = language === 'hu';
    const settingTitle = (hu, en) => isHu ? hu : en;
    const pill = (label, active, onPress) => (
      <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive, { marginRight: 7, marginBottom: 7 }]}>
        <Text style={[styles.chipText, active && { color: '#11150D' }]}>{label}</Text>
      </TouchableOpacity>
    );
    const toggleRow = (title, description, value, setter) => (
      <TouchableOpacity onPress={() => setter(!value)} style={[styles.row, { paddingVertical: 12, alignItems: 'center' }]}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          {!!description && <Text style={styles.muted}>{description}</Text>}
        </View>
        <View style={{ width: 48, height: 28, borderRadius: 20, backgroundColor: value ? accentColor : '#50564B', justifyContent: 'center', padding: 3 }}>
          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: value ? '#11150D' : '#D5D8D0', alignSelf: value ? 'flex-end' : 'flex-start' }} />
        </View>
      </TouchableOpacity>
    );
    const weeklyWorkouts = (workoutLogs || []).filter(log => {
      const date = new Date(log.date || log.completedAt || 0);
      return !Number.isNaN(date.getTime()) && (Date.now() - date.getTime()) <= 7 * 86400000;
    }).length;
    const todayMeals = (foodEntries || []).filter(entry => entry.date === today).length;
    const exportPayload = {
      exportedAt: new Date().toISOString(), profileGender, answers, profileComplete, profileXpAwarded,
      completedDates, water, waterDate, weightEntries, xp, workoutLogs, foodEntries,
      settings: { language, themeMode, glassSizeMl, restSeconds, allergies, foodPreference,
        mealsPerDay, weightUnit, heightUnit, volumeUnit, textSize, highContrast,
        reduceMotion, soundEnabled, weeklySummaryEnabled }
    };

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <Text style={styles.eyebrow}>BIFIT PERSONALIZATION</Text>
        <Text style={styles.pageTitle}>{settingTitle('Beállítások', 'Settings')}</Text>

        {card(<>
          <Text style={styles.cardTitle}>{settingTitle('1. Megjelenés', '1. Appearance')}</Text>
          <Text style={styles.muted}>{settingTitle('Válaszd ki, hogyan jelenjen meg az alkalmazás.', 'Choose how the app should look.')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
            {pill(settingTitle('Sötét', 'Dark'), themeMode === 'dark', () => setThemeMode('dark'))}
            {pill(settingTitle('Világos', 'Light'), themeMode === 'light', () => setThemeMode('light'))}
            {pill(settingTitle('Eszköz követése', 'Follow device'), themeMode === 'system', () => setThemeMode('system'))}
          </View>
          {themeMode === 'system' && <Text style={styles.muted}>{settingTitle('Az alkalmazás a telefon megjelenési beállítását követi.', 'The app follows your device appearance setting.')}</Text>}
        </>)}

        {card(<>
          <Text style={styles.cardTitle}>{settingTitle('2. Nyelv', '2. Language')}</Text>
          <View style={styles.row}>
            {button('🇬🇧 English', () => setLanguage('en'), language !== 'en')}
            {button('🇭🇺 Magyar', () => setLanguage('hu'), language !== 'hu')}
          </View>
        </>)}

        {card(<>
          <Text style={styles.cardTitle}>{settingTitle('3. Vízbevitel', '3. Water Intake')}</Text>
          <Text style={styles.muted}>{settingTitle('Pohárméret és napi cél. A cél egy hozzávetőleges 2000 ml-es napi mennyiségből számolódik, és személyre szabottan módosítható.', 'Glass size and daily goal. The goal is calculated from an approximate 2000 ml daily target and can be adjusted to your needs.')}</Text>
          <TextInput value={glassSizeInput} onChangeText={setGlassSizeInput} keyboardType="numeric" placeholder="250" placeholderTextColor={MUTED} style={styles.input} />
          <Text style={styles.muted}>{settingTitle(`Jelenlegi méret: ${glassSizeMl} ml · Napi cél: ${goalWater} pohár (${goalWater * glassSizeMl} ml)`, `Current size: ${glassSizeMl} ml · Daily goal: ${goalWater} glasses (${goalWater * glassSizeMl} ml)`)}</Text>
          {button(settingTitle('POHÁRMÉRET MENTÉSE', 'SAVE GLASS SIZE'), applyGlassSize)}
          <Text style={[styles.muted, { marginTop: 8 }]}>{settingTitle('A napi cél becslés, nem orvosi előírás.', 'The daily target is an estimate, not medical advice.')}</Text>
        </>)}

        {card(<>
          <Text style={styles.cardTitle}>{settingTitle('4. Edzési preferenciák', '4. Workout Preferences')}</Text>
          <Text style={styles.muted}>{settingTitle('Válaszd ki az edzésnapokat. A heti terv ezeket a napokat használja.', 'Choose your training days. Your weekly schedule uses these days.')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
            {dayNames.map((day, index) => pill(day.slice(0, 3), selectedTrainingDays.includes(index), () => {
              setSelectedTrainingDays(prev => {
                const next = prev.includes(index) ? prev.filter(x => x !== index) : [...prev, index].sort((a,b) => a-b);
                if (next.length < 2) return prev;
                setAnswers(a => ({ ...a, days: String(next.length) }));
                return next;
              });
            }))}
          </View>
          <Text style={styles.muted}>{settingTitle(`${selectedTrainingDays.length} edzésnap hetente`, `${selectedTrainingDays.length} training days per week`)}</Text>
          <Text style={[styles.cardTitle, { marginTop: 12 }]}>{settingTitle('Pihenőidő a sorozatok között', 'Rest time between sets')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
            {[30,45,60,90,120,180].map(v => pill(`${v} sec`, restSeconds === v, () => setRestSeconds(v)))}
          </View>
          <Text style={[styles.cardTitle, { marginTop: 12 }]}>{settingTitle('Felszerelés', 'Equipment')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
            {['Gym', 'Home with equipment', 'Home without equipment'].map(v => pill(settingTitle(v === 'Gym' ? 'Edzőterem' : v === 'Home with equipment' ? 'Otthon, eszközökkel' : 'Otthon, eszköz nélkül', v), answers.equipment === v, () => setAnswers(a => ({ ...a, equipment: v }))))}
          </View>
        </>)}

        {card(<>
          <Text style={styles.cardTitle}>{settingTitle('5. Táplálkozási preferenciák', '5. Nutrition Preferences')}</Text>
          <Text style={styles.muted}>{settingTitle('Allergiák és étkezési preferenciák mentése a profilodhoz.', 'Save allergies and food preferences to your profile.')}</Text>
          <Text style={[styles.cardTitle, { marginTop: 12 }]}>{settingTitle('Allergiák / kerülendő összetevők', 'Allergies / ingredients to avoid')}</Text>
          <TextInput value={allergies} onChangeText={setAllergies} placeholder={settingTitle('Pl. mogyoró, tej', 'e.g. peanuts, milk')} placeholderTextColor={MUTED} style={styles.input} />
          <Text style={[styles.cardTitle, { marginTop: 10 }]}>{settingTitle('Étkezési preferencia', 'Food preference')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
            {[
              ['No preference', settingTitle('Nincs megkötés', 'No preference')],
              ['Vegetarian', settingTitle('Vegetáriánus', 'Vegetarian')],
              ['Vegan', settingTitle('Vegán', 'Vegan')],
              ['Pescatarian', settingTitle('Peszkatáriánus', 'Pescatarian')]
            ].map(([v,l]) => pill(l, foodPreference === v, () => setFoodPreference(v)))}
          </View>
          <Text style={[styles.cardTitle, { marginTop: 10 }]}>{settingTitle('Étkezések száma naponta', 'Meals per day')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
            {[2,3,4,5,6].map(v => pill(String(v), mealsPerDay === v, () => setMealsPerDay(v)))}
          </View>
          <Text style={styles.muted}>{settingTitle('Ezeket a preferenciákat elmentjük. Az ételajánlások allergénadatainak teljes szűrése külön adatbázis-fejlesztést igényel, ezért kérjük, mindig ellenőrizd az összetevőket.', 'These preferences are saved to your profile. Full allergen filtering requires ingredient-level data, so always check food labels.')}</Text>
        </>)}

        {card(<>
          <Text style={styles.cardTitle}>{settingTitle('6. Mértékegységek', '6. Units')}</Text>
          <Text style={styles.muted}>{settingTitle('Válaszd ki a számodra kényelmes mértékegységeket.', 'Choose your preferred measurement units.')}</Text>
          <Text style={[styles.cardTitle, { marginTop: 10 }]}>{settingTitle('Testsúly', 'Weight')}</Text>
          <View style={styles.row}>{pill('kg', weightUnit === 'kg', () => setWeightUnit('kg'))}{pill('lb', weightUnit === 'lb', () => setWeightUnit('lb'))}</View>
          <Text style={styles.cardTitle}>{settingTitle('Magasság', 'Height')}</Text>
          <View style={styles.row}>{pill('cm', heightUnit === 'cm', () => setHeightUnit('cm'))}{pill('in', heightUnit === 'in', () => setHeightUnit('in'))}</View>
          <Text style={styles.cardTitle}>{settingTitle('Folyadék', 'Volume')}</Text>
          <View style={styles.row}>{pill('ml', volumeUnit === 'ml', () => setVolumeUnit('ml'))}{pill('oz', volumeUnit === 'oz', () => setVolumeUnit('oz'))}</View>
          <Text style={styles.muted}>{settingTitle('A választások elmentődnek. A profil alapadatai jelenleg kg/cm egységben tárolódnak.', 'Preferences are saved. Profile measurements are currently stored in kg/cm internally.')}</Text>
        </>)}

        {card(<>
          <Text style={styles.cardTitle}>{settingTitle('7. Akadálymentesség', '7. Accessibility')}</Text>
          <Text style={styles.cardTitle}>{settingTitle('Szövegméret', 'Text size')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
            {[
              ['small', settingTitle('Kicsi', 'Small')],
              ['normal', settingTitle('Normál', 'Normal')],
              ['large', settingTitle('Nagy', 'Large')]
            ].map(([v,l]) => pill(l, textSize === v, () => setTextSize(v)))}
          </View>
          {toggleRow(settingTitle('Erősebb kontraszt', 'High contrast'), settingTitle('Kontrasztosabb felületek', 'Increase interface contrast'), highContrast, setHighContrast)}
          {toggleRow(settingTitle('Animációk csökkentése', 'Reduce animations'), settingTitle('Kevesebb mozgó effekt', 'Reduce motion effects'), reduceMotion, setReduceMotion)}
          <Text style={styles.muted}>{settingTitle('A betűméret az alkalmazás szövegeire érvényesül, a kontraszt erősebb színeket használ, a csökkentett animáció pedig kikapcsolja a képernyőváltások mozgását.', 'Text size applies across app text, high contrast strengthens interface colors, and reduced motion disables screen transition animations.')}</Text>
        </>)}

        {card(<>
          <Text style={styles.cardTitle}>{settingTitle('8. Hanghatások', '8. Sound Effects')}</Text>
          {toggleRow(settingTitle('Hanghatások', 'Sound effects'), settingTitle('Rövid hangjelzések gombnyomáskor és fontos eseményeknél.', 'Play short sounds for button presses and key events.'), soundEnabled, setSoundEnabled)}
          {button(settingTitle('HANG TESZTELÉSE', 'TEST SOUND'), () => playSound('success'), true)}
          <Text style={styles.muted}>{settingTitle('A hang lejátszása az eszköz és a böngésző támogatásától függ. iPhone-on előfordulhat, hogy a néma mód vagy a böngésző beállításai korlátozzák.', 'Playback depends on device and browser support. On iPhone, Silent Mode or browser settings may limit sound.')}</Text>
        </>)}

        {card(<>
          <Text style={styles.cardTitle}>{settingTitle('9. Heti összefoglaló', '9. Weekly Summary')}</Text>
          {toggleRow(settingTitle('Heti aktivitási összefoglaló', 'Weekly activity summary'), settingTitle('Az összefoglaló megjelenítése itt a Beállításokban.', 'Show your activity summary here in Settings.'), weeklySummaryEnabled, setWeeklySummaryEnabled)}
          {weeklySummaryEnabled && <>
            <View style={styles.profileRow}><Text style={styles.muted}>{settingTitle('Edzések az elmúlt 7 napban', 'Workouts in the last 7 days')}</Text><Text style={styles.profileValue}>{weeklyWorkouts}</Text></View>
            <View style={styles.profileRow}><Text style={styles.muted}>{settingTitle('Mai naplózott étkezések', 'Meals logged today')}</Text><Text style={styles.profileValue}>{todayMeals}</Text></View>
            <View style={styles.profileRow}><Text style={styles.muted}>{settingTitle('Összes XP', 'Total XP')}</Text><Text style={styles.profileValue}>{xp}</Text></View>
          </>}
        </>)}

        {card(<>
          <Text style={styles.cardTitle}>{settingTitle('10. Adatvédelem és adatok', '10. Privacy & Data')}</Text>
          <Text style={styles.muted}>{settingTitle('Az adataid ezen az eszközön, helyi tárhelyen kerülnek mentésre.', 'Your data is stored locally on this device.')}</Text>
          {button(settingTitle('ADATOK EXPORTÁLÁSA', 'EXPORT MY DATA'), () => {
            setExportDataText(JSON.stringify(exportPayload, null, 2));
            setExportModalVisible(true);
          })}
          {button(settingTitle('VISSZA A PROFILHOZ AZ ADATOK TÖRLÉSÉHEZ', 'GO TO PROFILE TO RESET APP DATA'), () => setTab('Profile'), true)}
        </>)}

        {card(<>
          <Text style={styles.cardTitle}>{settingTitle('11. A BIFIT-ről', '11. About BIFIT')}</Text>
          <Text style={styles.bigNumber}>BIFIT</Text>
          <Text style={styles.muted}>Version 2.2</Text>
          <Text style={styles.muted}>{settingTitle('Személyes fitneszplatform edzéskövetéshez, táplálkozáshoz és fejlődéshez.', 'Your personal fitness platform for training, nutrition and progress tracking.')}</Text>
          <Text style={styles.muted}>{settingTitle('Az alkalmazásban szereplő célértékek becslések, nem helyettesítik szakember tanácsát.', 'Targets shown in the app are estimates and do not replace professional advice.')}</Text>
        </>)}

        <Modal visible={exportModalVisible} animationType={reduceMotion ? "none" : "slide"} transparent onRequestClose={() => setExportModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.78)', justifyContent: 'center', padding: 18 }}>
            <View style={[styles.card, { maxHeight: '85%' }]}>
              <Text style={styles.cardTitle}>{settingTitle('Adatok exportálása', 'Export data')}</Text>
              <Text style={styles.muted}>{settingTitle('Másold ki az alábbi JSON-adatokat, és mentsd el biztonságos helyre.', 'Copy the JSON data below and save it somewhere safe.')}</Text>
              <TextInput value={exportDataText} editable={false} multiline selectTextOnFocus style={[styles.input, { minHeight: 260, textAlignVertical: 'top' }]} />
              {button(settingTitle('BEZÁRÁS', 'CLOSE'), () => setExportModalVisible(false))}
            </View>
          </View>
        </Modal>

        {button(settingTitle('VISSZA A PROFILHOZ', 'BACK TO PROFILE'), () => setTab('Profile'), true)}
      </ScrollView>
    );
  };

  const screens = {
    Home: homeScreen,
    Workout: workoutScreen,
    Nutrition: nutritionScreen,
    Stretching: stretchingScreen,
    Calendar: calendarScreen,
    Coach: coachScreen,
    Progress: progressScreen,
    Profile: profileScreen,
    Settings: settingsScreen
  };

  const tabs = [
    { id: 'Home', icon: '⌂', label: 'Home' },
    { id: 'Workout', icon: '🏋️', label: 'Workout' },
    { id: 'Nutrition', icon: '🥗', label: 'Nutrition' },
    { id: 'Stretching', icon: '🧘', label: 'Stretch' },
    { id: 'Calendar', icon: '📅', label: 'Calendar' },
    { id: 'Progress', icon: '📈', label: 'Progress' },
    { id: 'Profile', icon: '◉', label: 'Profile' }
  ];

  if (!hydrated) {
    return (
      <LanguageContext.Provider value={language}>
      <AccessibilityContext.Provider value={{ textSize, highContrast, reduceMotion }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={resolvedTheme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={resolvedTheme === 'light' ? '#F4F6F1' : BG} />
        <View style={styles.loading}>
          <Text style={styles.logo}>BIFIT</Text>
          <Text style={styles.muted}>Loading your fitness platform...</Text>
        </View>
      </SafeAreaView>
      </AccessibilityContext.Provider>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={language}>
    <AccessibilityContext.Provider value={{ textSize, highContrast, reduceMotion }}>
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={resolvedTheme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={resolvedTheme === 'light' ? '#F4F6F1' : BG} />
      <View style={styles.content}>
        {showPersonalization ? personalizationScreen() :
          selectedExercise ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity onPress={() => {
                setSelectedExercise(null);
                setExpandedExerciseInfo(false);
              }}>
                <Text style={styles.green}>← BACK TO EXERCISES</Text>
              </TouchableOpacity>

              <Text style={styles.pageTitle}>{selectedExercise.name}</Text>
              <Text style={styles.muted}>
                {selectedExercise.muscle} · {selectedExercise.level}
              </Text>

              {card(
                <>
                  <Text style={styles.coachIcon}>{selectedExercise.emoji}</Text>
                  <Text style={styles.cardTitle}>Exercise overview</Text>
                  <Text style={styles.muted}>{selectedExercise.instructions}</Text>
                  <View style={styles.profileRow}>
                    <Text style={styles.muted}>Sets</Text>
                    <Text style={styles.profileValue}>{selectedExercise.sets}</Text>
                  </View>
                  <View style={styles.profileRow}>
                    <Text style={styles.muted}>Reps</Text>
                    <Text style={styles.profileValue}>{selectedExercise.reps}</Text>
                  </View>
                  <View style={styles.profileRow}>
                    <Text style={styles.muted}>Equipment</Text>
                    <Text style={styles.profileValue}>{selectedExercise.equipmentNeeded}</Text>
                  </View>
                  <View style={styles.profileRow}>
                    <Text style={styles.muted}>Rest time</Text>
                    <Text style={styles.profileValue}>{selectedExercise.rest}</Text>
                  </View>
                  <Text style={styles.cardTitle}>Expected results</Text>
                  <Text style={styles.muted}>{selectedExercise.results}</Text>
                </>
              )}

              <TouchableOpacity
                style={styles.infoToggle}
                onPress={() => setExpandedExerciseInfo(p => !p)}
              >
                <Text style={styles.cardTitle}>Exercise information</Text>
                <Text style={styles.green}>{expandedExerciseInfo ? '−' : '+'}</Text>
              </TouchableOpacity>

              {expandedExerciseInfo && (
                <>
                  {card(
                    <>
                      <Text style={styles.cardTitle}>How to perform</Text>
                      {selectedExercise.steps.map((s, i) => (
                        <Text key={i} style={styles.instructionLine}>
                          <Text style={styles.green}>{i + 1}. </Text>{s}
                        </Text>
                      ))}
                    </>
                  )}
                  {card(
                    <>
                      <Text style={styles.cardTitle}>Primary muscles</Text>
                      <Text style={styles.muted}>{selectedExercise.muscle}</Text>
                      <Text style={styles.cardTitle}>Secondary muscles</Text>
                      <Text style={styles.muted}>{(selectedExercise.secondaryMuscles || []).join(', ') || 'Nincs külön megadott másodlagos izomcsoport.'}</Text>
                      <Text style={styles.cardTitle}>Common mistakes</Text>
                      {selectedExercise.mistakes.map((s, i) => (
                        <Text key={i} style={styles.instructionLine}>• {s}</Text>
                      ))}
                      <Text style={styles.cardTitle}>Trainer tips</Text>
                      {selectedExercise.tips.map((s, i) => (
                        <Text key={i} style={styles.instructionLine}>• {s}</Text>
                      ))}
                    </>
                  )}
                  {card(
                    <>
                      <Text style={styles.cardTitle}>Variations</Text>
                      <Text style={styles.green}>Easier</Text>
                      <Text style={styles.muted}>{selectedExercise.easier}</Text>
                      <Text style={styles.green}>Harder</Text>
                      <Text style={styles.muted}>{selectedExercise.harder}</Text>
                      <Text style={styles.cardTitle}>Home alternatives</Text>
                      <Text style={styles.muted}>{selectedExercise.homeAlternative}</Text>
                    </>
                  )}
                </>
              )}
            </ScrollView>
          ) : screens[tab]()}
      </View>

      {!showPersonalization && !selectedExercise && (
        <View style={styles.tabBar}>
          {tabs.map(t => (
            <TouchableOpacity
              key={t.id}
              style={styles.tab}
              onPress={() => {
                playSound('tap');
                setSelectedExercise(null);
                setTab(t.id);
              }}
            >
              <Text style={[styles.tabIcon, tab === t.id && { color: accentColor }]}>
                {t.icon}
              </Text>
              <Text style={[styles.tabLabel, tab === t.id && { color: accentColor }]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Modal
        visible={!!selectedFood}
        transparent
        animationType={reduceMotion ? "none" : "fade"}
        onRequestClose={() => setSelectedFood(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.infoModalCard}>
            <View style={styles.infoModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>BIFIT SMART NUTRITION</Text>
                <Text style={styles.pageTitle}>{selectedFood?.name || 'Food information'}</Text>
              </View>
              <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedFood(null)}>
                <Text style={styles.green}>✕</Text>
              </TouchableOpacity>
            </View>
            {selectedFood && (() => {
              const guide = getFoodGuide(selectedFood);
              return (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.foodDetailHeading}>Serving size / Recommended portion</Text>
                  <Text style={styles.muted}>{guide.serving}</Text>
                  <View style={styles.foodMacroGrid}>
                    <View style={styles.foodMacro}><Text style={styles.green}>{selectedFood.calories || 0}</Text><Text style={styles.muted}>kcal</Text></View>
                    <View style={styles.foodMacro}><Text style={styles.green}>{selectedFood.protein || 0} g</Text><Text style={styles.muted}>Protein</Text></View>
                    <View style={styles.foodMacro}><Text style={styles.green}>{selectedFood.carbs || 0} g</Text><Text style={styles.muted}>Carbs</Text></View>
                    <View style={styles.foodMacro}><Text style={styles.green}>{selectedFood.fat || 0} g</Text><Text style={styles.muted}>Fat</Text></View>
                  </View>
                  <Text style={styles.foodDetailHeading}>What can it support?</Text>
                  <View style={styles.foodTagRow}>{guide.goals.map(goal => <View key={goal} style={styles.foodTag}><Text style={styles.foodTagText}>{goal}</Text></View>)}</View>
                  <Text style={styles.foodDetailHeading}>Why is it useful?</Text>
                  <Text style={styles.muted}>{guide.bestFor} {guide.benefits}</Text>
                  <Text style={styles.foodDetailHeading}>Key nutrients</Text>
                  <Text style={styles.muted}>{guide.nutrients}</Text>
                  <Text style={styles.foodDetailHeading}>When can you eat it?</Text>
                  <Text style={styles.muted}>{guide.timing}</Text>
                  <Text style={styles.foodDetailHeading}>Things to know</Text>
                  <Text style={styles.muted}>{guide.caution}</Text>
                  <Text style={styles.foodDetailHeading}>Alternatives</Text>
                  <Text style={styles.muted}>{guide.alternatives}</Text>
                  <Text style={styles.smallNote}>Nutrition values are estimates for the stated example portion. Brands, recipes and cooking methods change the numbers. Food does not cause bulking or cutting by itself; your overall intake and activity matter. For custom entries, information is not verified.</Text>
                  {button('+ ADD THIS FOOD TO DIARY', () => { addMeal(selectedFood); setSelectedFood(null); })}
                </ScrollView>
              );
            })()}
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!activeInfo}
        transparent
        animationType={reduceMotion ? "none" : "fade"}
        onRequestClose={() => setActiveInfo(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.infoModalCard}>
            <View style={styles.infoModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>BIFIT · {activeInfo === 'water' ? 'HYDRATION GUIDE' : 'NUTRITION GUIDE'}</Text>
                <Text style={styles.pageTitle}>{activeInfo === 'water' ? 'Why hydration matters' : activeInfo === 'calories' ? 'Understanding calories' : activeInfo === 'protein' ? 'Why protein matters' : activeInfo === 'carbs' ? 'Why carbohydrates matter' : 'Why dietary fats matter'}</Text>
              </View>
              <TouchableOpacity style={styles.modalClose} onPress={() => setActiveInfo(null)}>
                <Text style={styles.green}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {activeInfo === 'water' ? (
                <>
                  <Text style={styles.foodDetailHeading}>Your current daily target</Text>
                  <Text style={styles.infoHighlight}>{goalWater} glasses · about {(goalWater * 0.25).toFixed(2)} litres</Text>
                  <Text style={styles.muted}>This estimate assumes a 250 ml glass. If you know your bottle or glass size, use that actual volume instead.</Text>
                  <Text style={styles.foodDetailHeading}>Why drinking enough matters</Text>
                  <Text style={styles.muted}>Water helps regulate body temperature, transport nutrients, support digestion and maintain normal muscle and physical function. During exercise, fluids help replace water lost through sweat.</Text>
                  <Text style={styles.foodDetailHeading}>A profile-based starting estimate</Text>
                  <Text style={styles.muted}>{answers.weight ? `Based on your profile weight of ${answers.weight} kg, a rough starting range of 30–35 ml per kg would be about ${(Number(answers.weight) * 0.03).toFixed(1)}–${(Number(answers.weight) * 0.035).toFixed(1)} litres per day.` : 'Complete your profile weight to see a rough body-weight-based starting estimate.'}</Text>
                  <Text style={styles.muted}>This is not a strict prescription. Needs change with heat, exercise duration, sweating, diet and health. Drink regularly and use thirst as a guide; do not force excessive amounts of water.</Text>
                  <Text style={styles.smallNote}>People with medical conditions or clinician-directed fluid limits should follow their healthcare professional’s advice.</Text>
                </>
              ) : activeInfo === 'protein' ? (
                <>
                  <Text style={styles.foodDetailHeading}>Your current daily target</Text>
                  <Text style={styles.infoHighlight}>{goalProtein} g protein</Text>
                  <Text style={styles.foodDetailHeading}>Why protein matters</Text>
                  <Text style={styles.muted}>Protein supplies amino acids used to build and repair muscles and other body tissues. It also supports enzymes, hormones and normal immune function.</Text>
                  <Text style={styles.foodDetailHeading}>How to use your target</Text>
                  <Text style={styles.muted}>Your target is an estimate based on your fitness profile and goal. Spread protein across meals and choose varied sources such as eggs, dairy, fish, lean meat, beans, lentils, tofu and soy foods.</Text>
                  <Text style={styles.smallNote}>More is not automatically better. Individual needs vary with age, health, training and total diet.</Text>
                </>
              ) : activeInfo === 'carbs' ? (
                <>
                  <Text style={styles.foodDetailHeading}>Your current daily target</Text>
                  <Text style={styles.infoHighlight}>{goalCarbs} g carbohydrates</Text>
                  <Text style={styles.foodDetailHeading}>Why carbohydrates matter</Text>
                  <Text style={styles.muted}>Carbohydrates are an important source of energy, especially for the brain and higher-intensity exercise. They help replenish muscle glycogen after training.</Text>
                  <Text style={styles.foodDetailHeading}>Useful food sources</Text>
                  <Text style={styles.muted}>Oats, rice, potatoes, fruit, beans, lentils and wholegrain bread provide carbohydrates. Higher-fibre choices can also support digestion and fullness.</Text>
                  <Text style={styles.smallNote}>Choose portions that fit your overall energy needs, activity and preferences. Carbohydrates are not inherently fattening.</Text>
                </>
              ) : activeInfo === 'fat' ? (
                <>
                  <Text style={styles.foodDetailHeading}>Your current daily target</Text>
                  <Text style={styles.infoHighlight}>{goalFat} g fat</Text>
                  <Text style={styles.foodDetailHeading}>Why dietary fats matter</Text>
                  <Text style={styles.muted}>Dietary fats provide energy, help absorb vitamins A, D, E and K, form part of cell membranes and support hormone production.</Text>
                  <Text style={styles.foodDetailHeading}>Useful food sources</Text>
                  <Text style={styles.muted}>Olive oil, nuts, seeds, avocado and oily fish provide mostly unsaturated fats. Include a variety of sources and pay attention to portions because fats are energy-dense.</Text>
                  <Text style={styles.smallNote}>Do not eliminate dietary fat. The type and overall amount both matter.</Text>
                </>
              ) : (
                <>
                  <Text style={styles.foodDetailHeading}>Your current daily target</Text>
                  <Text style={styles.infoHighlight}>{goalCalories.toLocaleString()} kcal</Text>
                  <Text style={styles.foodDetailHeading}>Why calories matter</Text>
                  <Text style={styles.muted}>Calories measure the energy food provides. Your body uses energy for basic functions, daily movement, exercise, recovery and growth.</Text>
                  <Text style={styles.foodDetailHeading}>How your estimate is calculated</Text>
                  <Text style={styles.muted}>{answers.age && answers.height && answers.weight ? `Your estimate uses your profile age (${answers.age}), height (${answers.height} cm), weight (${answers.weight} kg), training frequency (${answers.days} days per week) and selected goal (${answers.goal}).` : 'Complete your age, height and weight in your fitness profile to calculate a more useful estimate.'}</Text>
                  <Text style={styles.muted}>{profileGender === 'female' ? 'The current estimate uses the female Mifflin–St Jeor equation' : 'The current estimate uses the male Mifflin–St Jeor equation'} and an activity multiplier based on planned training days. It is only an estimate; actual needs vary.</Text>
                  <Text style={styles.foodDetailHeading}>How to use the target</Text>
                  <Text style={styles.muted}>Muscle gain usually requires a modest energy surplus alongside progressive training. Fat loss, when appropriate, uses a modest deficit. Food quality, protein, sleep and consistency also matter.</Text>
                  {Number(answers.age) > 0 && Number(answers.age) < 18 && <Text style={styles.smallNote}>Because your profile indicates you are under 18, BIFIT does not apply an automatic calorie deficit. Growth and development needs are individual; seek advice from a qualified healthcare professional or dietitian for personal targets.</Text>}
                  <Text style={styles.smallNote}>Do not treat this estimate as a medical prescription or a strict daily pass/fail score.</Text>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </AccessibilityContext.Provider>
    </LanguageContext.Provider>
  );
}

function Stat({ styles, icon, value, label }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

function Macro({ styles, label, value, goal, unit }) {
  return (
    <View style={styles.macroCard}>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', gap:5}}><Text style={styles.muted}>{label}</Text></View>
      <Text style={styles.statNumber}>{Math.round(value)}{unit}</Text>
      <Text style={styles.muted}>/ {goal}{unit}</Text>
      <View style={styles.track}>
        <View style={[
          styles.fill,
          { width: `${Math.min(100, goal ? value / goal * 100 : 0)}%` }
        ]} />
      </View>
    </View>
  );
}

const createStyles = (accent = GREEN, theme = 'dark', highContrast = false) => {
  const light = theme === 'light';
  const BG = light ? (highContrast ? '#FFFFFF' : '#F1F4EE') : '#10120F';
  const CARD = light ? (highContrast ? '#FFFFFF' : '#FFFFFF') : '#1C201A';
  const MUTED = light ? (highContrast ? '#20291D' : '#465344') : '#92998C';
  const primaryText = light ? '#172116' : '#FFFFFF';
  const border = light ? (highContrast ? '#394A34' : '#DCE4D7') : '#30352C';
  const soft = light ? '#E5EDE0' : '#303D25';
  const track = light ? '#DCE5D7' : '#343A30';
  const textAccent = light ? (accent === '#F28AB2' ? '#963B63' : '#426522') : accent;
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, width: '100%' },
  genderChoiceRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  genderChoice: { flex: 1, minWidth: 0, borderWidth: 1, borderColor: border, borderRadius: 13, padding: 13, backgroundColor: light ? '#FFFFFF' : '#171A15' },
  genderChoiceTitle: { color: primaryText, fontSize: 14, fontWeight: '900', marginBottom: 6 },
  content: { flex: 1, minHeight: 0, width: '100%', maxWidth: 1240, alignSelf: 'center', paddingHorizontal: 18, paddingTop: 14 },
  homeScrollContent: { paddingBottom: 24 },
  homeFeatureRow: { width: '100%', flexDirection: 'column', gap: 0 },
  homeFeatureRowWide: { flexDirection: 'row', alignItems: 'stretch', gap: 18 },
  homeFeatureCard: { minWidth: 0 },
  desktopFeatureCard: { flex: 1, marginTop: 18, marginBottom: 14, minHeight: 190, justifyContent: 'center' },
  profileFeatureCard: { backgroundColor: light ? '#EAF3E5' : '#273322', marginTop: 18 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  logo: { fontSize: 28, fontWeight: '900', color: textAccent, letterSpacing: 2 },
  homeLogo: { fontSize: 50, color: accent, letterSpacing: 3 },
  green: { color: textAccent, fontWeight: '900' },
  eyebrow: { fontSize: 9, color: textAccent, letterSpacing: 2, fontWeight: '900', marginBottom: 8 },
  pageTitle: { fontSize: 30, fontWeight: '900', color: primaryText, marginTop: 8, marginBottom: 7 },
  heroTitle: { fontSize: 25, fontWeight: '900', color: primaryText, marginVertical: 10 },
  featureTitle: { fontSize: 25, fontWeight: '900', color: primaryText, marginVertical: 10 },
  heroDescription: { fontSize: 13, color: theme === 'light' ? '#465043' : '#CBD2C4', lineHeight: 20, marginBottom: 10 },
  hero: { backgroundColor: light ? '#E5F1DE' : '#252F20', borderRadius: 20, padding: 21, marginVertical: 20, overflow: 'hidden', borderWidth: light ? 1 : 0, borderColor: light ? '#C9DDBF' : 'transparent' },
  heroDecoration: { position: 'absolute', right: -5, bottom: -20, fontSize: 60, fontWeight: '900', color: '#FFFFFF08' },
  muted: { fontSize: 12, color: MUTED, lineHeight: 19 },
  card: { backgroundColor: CARD, borderRadius: 17, padding: 17, marginBottom: 14 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 17, marginBottom: 12 },
  sectionTitle: { fontSize: 16, color: primaryText, fontWeight: '900' },
  statsRow: { flexDirection: 'row', gap: 9, marginVertical: 15 },
  statCard: { flex: 1, backgroundColor: CARD, borderRadius: 14, padding: 12 },
  statIcon: { fontSize: 20, marginBottom: 8 },
  statNumber: { fontSize: 19, color: primaryText, fontWeight: '900', marginVertical: 3 },
  bigNumber: { fontSize: 27, color: accent, fontWeight: '900', marginVertical: 8 },
  track: { height: 7, backgroundColor: track, borderRadius: 6, overflow: 'hidden', marginVertical: 12 },
  fill: { height: 7, backgroundColor: accent, borderRadius: 6 },
  greenButton: { backgroundColor: accent, padding: 15, borderRadius: 11, alignItems: 'center', marginTop: 14 },
  greenButtonText: { fontSize: 11, color: '#11150D', fontWeight: '900', letterSpacing: 1 },
  secondaryButton: { backgroundColor: soft, borderWidth: light ? 1 : 0, borderColor: light ? '#C9DDBF' : 'transparent', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  secondaryButtonText: { fontSize: 10, color: textAccent, fontWeight: '900' },
  avatar: { width: 43, height: 43, borderRadius: 22, backgroundColor: CARD, borderWidth: 1, borderColor: accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, color: accent, fontWeight: '900' },
  coachCard: { backgroundColor: CARD, borderRadius: 15, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15 },
  coachIcon: { fontSize: 28, color: accent, marginBottom: 10 },
  cardTitle: { fontSize: 14, color: primaryText, fontWeight: '900', marginBottom: 5 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekDay: { alignItems: 'center', gap: 8 },
  dayDot: { width: 31, height: 31, borderRadius: 16, backgroundColor: light ? '#E4EADF' : '#30352C', alignItems: 'center', justifyContent: 'center' },
  dayDotDone: { backgroundColor: accent },
  dayDotText: { fontSize: 11, color: primaryText, fontWeight: '900' },
  exercise: { backgroundColor: CARD, borderRadius: 13, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 9 },
  exerciseEmoji: { fontSize: 23 },
  exerciseCheck: { fontSize: 22, color: accent },
  input: { backgroundColor: CARD, borderWidth: 1, borderColor: border, borderRadius: 11, padding: 15, color: primaryText, fontSize: 14, marginTop: 9 },
  optionCard: { backgroundColor: CARD, borderWidth: 1, borderColor: border, borderRadius: 13, padding: 17, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optionSelected: { borderColor: accent, backgroundColor: light ? '#EAF3E5' : '#303D25' },
  optionText: { color: primaryText, fontWeight: '800', fontSize: 14 },
  progressRow: { flexDirection: 'row', gap: 5, marginVertical: 18 },
  stepBar: { flex: 1, height: 5, borderRadius: 5 },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: border },
  profileValue: { fontSize: 12, color: textAccent, fontWeight: '900' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 8 },
  chip: { backgroundColor: CARD, borderWidth: 1, borderColor: border, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14, marginRight: 8 },
  chipActive: { backgroundColor: accent, borderColor: accent },
  chipText: { fontSize: 11, color: MUTED, fontWeight: '800' },
  macroRow: { flexDirection: 'row', gap: 7 },
  macroCard: { flex: 1, backgroundColor: CARD, borderRadius: 13, padding: 11 },
  tabBar: { height: 68, width: '100%', maxWidth: 1240, alignSelf: 'center', flexShrink: 0, backgroundColor: light ? '#FFFFFF' : '#171A15', borderTopWidth: 1, borderTopColor: border, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 5 },
  tab: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center' },
  tabIcon: { fontSize: 19, color: MUTED, marginBottom: 4 },
  tabLabel: { fontSize: 8, color: MUTED, fontWeight: '800' },
  achievement: { backgroundColor: CARD, borderRadius: 13, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 9 },
  achievementIcon: { fontSize: 25, width: 35, textAlign: 'center' },
  chart: { height: 145, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingTop: 10 },
  chartColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 8, height: '100%' },
  chartBar: { width: 17, borderRadius: 6, minHeight: 8, backgroundColor: accent },
  danger: { fontSize: 10, color: '#E58B7F', fontWeight: '900' },
  comingSoonContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  comingSoonContent: { width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: CARD, borderRadius: 22, padding: 28, minHeight: 380 },
  comingSoonIcon: { fontSize: 55, color: accent, marginBottom: 25 },
  comingSoonTitle: { fontSize: 30, fontWeight: '900', color: primaryText, letterSpacing: 3, marginBottom: 12 },
  comingSoonHeading: { fontSize: 23, fontWeight: '900', color: textAccent, marginBottom: 16 },
  comingSoonDescription: { fontSize: 14, color: theme === 'light' ? '#465043' : '#CBD2C4', lineHeight: 24, textAlign: 'center', marginBottom: 25 },
  comingSoonBadge: { backgroundColor: soft, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16 },
  comingSoonBadgeText: { color: textAccent, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  daySelector: { backgroundColor: CARD, borderRadius: 12, padding: 13, marginRight: 8, minWidth: 68, alignItems: 'center', borderWidth: 1, borderColor: border },
  daySelectorActive: { backgroundColor: accent, borderColor: accent },
  daySelectorText: { color: primaryText, fontWeight: '900', fontSize: 13 },
  daySelectorSub: { color: MUTED, fontSize: 8, fontWeight: '900', marginTop: 5 },
  recommendationCard: { backgroundColor: CARD, borderRadius: 15, padding: 15, marginBottom: 10 },
  foodInfoButton: { backgroundColor: soft, borderRadius: 9, paddingVertical: 11, paddingHorizontal: 12, flex: 1, alignItems: 'center' },
  infoHeadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  infoPill: { backgroundColor: soft, borderRadius: 20, paddingVertical: 7, paddingHorizontal: 10 },
  infoPillText: { color: textAccent, fontSize: 9, fontWeight: '900' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.78)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  infoModalCard: { width: '100%', maxWidth: 620, maxHeight: '88%', backgroundColor: BG, borderColor: '#52663D', borderWidth: 1, borderRadius: 20, padding: 18 },
  infoModalHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 },
  modalClose: { backgroundColor: CARD, borderRadius: 20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  infoHighlight: { color: textAccent, fontSize: 25, fontWeight: '900', marginVertical: 6 },
  foodAddButton: { backgroundColor: accent, borderRadius: 9, paddingVertical: 11, paddingHorizontal: 12, flex: 1, alignItems: 'center' },
  foodAddText: { color: '#11150D', fontSize: 9, fontWeight: '900' },
  foodDetailCard: { backgroundColor: light ? '#FFFFFF' : '#222A1E', borderRadius: 17, borderWidth: 1, borderColor: light ? border : '#52663D', padding: 16, marginBottom: 16 },
  foodDetailHeading: { color: textAccent, fontSize: 12, fontWeight: '900', marginTop: 15, marginBottom: 6 },
  foodMacroGrid: { flexDirection: 'row', gap: 7, marginTop: 14 },
  foodMacro: { flex: 1, minWidth: 0, backgroundColor: CARD, borderRadius: 10, padding: 9, alignItems: 'center' },
  foodTagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 5 },
  foodTag: { backgroundColor: soft, borderRadius: 16, paddingVertical: 7, paddingHorizontal: 10 },
  foodTagText: { color: textAccent, fontSize: 10, fontWeight: '800' },
  recommendationTiming: { color: textAccent, fontSize: 10, fontWeight: '900', marginTop: 10, marginBottom: 5 },
  groupGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  groupChip: { backgroundColor: light ? '#E5EADF' : '#30352C', borderRadius: 18, paddingVertical: 9, paddingHorizontal: 12 },
  groupChipActive: { backgroundColor: accent },
  groupChipText: { color: primaryText, fontSize: 11, fontWeight: '800' },
  timerNumber: { fontSize: 48, color: accent, fontWeight: '900', textAlign: 'center', marginVertical: 15 },
  dividerLine: { height: 1, backgroundColor: border, marginVertical: 15 },
  smallNote: { fontSize: 11, color: MUTED, lineHeight: 19, marginVertical: 15 },
  infoToggle: { backgroundColor: CARD, borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  instructionLine: { color: theme === 'light' ? '#465043' : '#CBD2C4', fontSize: 12, lineHeight: 21, marginBottom: 7 },
  miniChartValue: { color: textAccent, fontSize: 9, fontWeight: '900' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: 18 },
  calendarCell: { width: '14.2857%', height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 9, marginBottom: 3 },
  calendarCellText: { color: primaryText, fontSize: 12, fontWeight: '800' },
  calendarWeekLabel: { color: MUTED, height: 28, textAlign: 'center', textAlignVertical: 'center' },
  calendarCellSelected: { backgroundColor: accent },
  calendarCellToday: { borderWidth: 1, borderColor: accent },
  calendarDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'transparent', marginTop: 3 },
  calendarDone: { backgroundColor: accent },
  calendarPlanned: { backgroundColor: '#8AA7F5' },
  calendarMissed: { backgroundColor: '#E58B7F' },
  calendarLegend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, flexWrap: 'wrap' },
  calendarLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 8, marginBottom: 5 },
  calendarLegendDot: { width: 7, height: 7, borderRadius: 4 }
  });
};


export default function App() {
  return (
    <BIFITErrorBoundary>
      <AppContent />
    </BIFITErrorBoundary>
  );
}
