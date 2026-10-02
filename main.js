/* ---------------- boot ---------------- */
(async function(){
 await initDb();
 if(!dbReady) seedFallback();
 render();
})();
