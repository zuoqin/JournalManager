using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JournalItems.Controllers
{
    public class ManifestController : Controller
    {
        //
        // GET: /Manifest/
        public ActionResult Index()
        {
            Response.Cache.SetCacheability(HttpCacheability.ServerAndNoCache);
            //Response.ContentType = "text/cache-manifest";
            Response.ContentType = "text/application-manifest";

            string path = HttpContext.Server.MapPath("~/Views/Manifest/index.cshtml");
            string text = System.IO.File.ReadAllText(path);
            //return View();
            return Content(text);
        }
	}
}