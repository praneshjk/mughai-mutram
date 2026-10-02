/* =========================================================
   MUGHAI MUTRAM — VISITOR SITE DATA LAYER (Supabase)

   window.MMStore gives the website:
     getAnnouncement()  getGallery()  getVideos()  addEnquiry(e)

   Everything comes from the online Supabase database that the
   admin site writes to. Settings live in supabase-config.js.
========================================================= */

(function () {

    const cfg = window.MM_SUPABASE;
    const configured = !!(cfg && cfg.url && cfg.anonKey);

    const SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    const MAX_PHOTOS = 24;
    const MAX_VIDEOS = 12;

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = src;
            s.onload = resolve;
            s.onerror = () => reject(new Error("Could not load " + src));
            document.head.appendChild(s);
        });
    }

    let clientPromise = null;

    function getClient() {
        if (!configured) {
            return Promise.reject(new Error("Supabase is not set up yet (see SETUP-GUIDE.md)"));
        }
        if (!clientPromise) {
            clientPromise = (async () => {
                await loadScript(SDK_URL);
                return window.supabase.createClient(cfg.url, cfg.anonKey, {
                    auth: { persistSession: false, autoRefreshToken: false }
                });
            })();
        }
        return clientPromise;
    }

    function check(result) {
        if (result.error) throw result.error;
        return result.data;
    }

    window.MMStore = {

        configured,

        async getAnnouncement() {
            const sb = await getClient();
            const row = check(await sb.from("announcement").select("text").eq("id", 1).maybeSingle());
            return row ? (row.text || "") : "";
        },

        async getGallery() {
            const sb = await getClient();
            const rows = check(await sb.from("gallery")
                .select("id,image_url,title,caption,created_at")
                .order("created_at", { ascending: false })
                .limit(MAX_PHOTOS));
            return rows.map(r => ({ id: r.id, image: r.image_url, title: r.title, caption: r.caption }));
        },

        async getVideos() {
            const sb = await getClient();
            const rows = check(await sb.from("videos")
                .select("id,type,url,title,caption,created_at")
                .order("created_at", { ascending: false })
                .limit(MAX_VIDEOS));
            return rows.map(r => ({ id: r.id, type: r.type, url: r.url, title: r.title, caption: r.caption }));
        },

        async addEnquiry(e) {
            const sb = await getClient();
            /* no .select() on purpose: visitors may add an enquiry but never read one */
            const { error } = await sb.from("enquiries").insert({
                name: e.name,
                phone: e.phone,
                program: e.program,
                message: e.message
            });
            if (error) throw error;
        }

    };

})();
