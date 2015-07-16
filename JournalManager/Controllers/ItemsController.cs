using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JournalManager.Controllers
{
    public class ItemsController : Controller
    {
        //
        // GET: /Items/
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult New()
        {
            return View("edit");
        }

        public ActionResult Edit(string id)
        {
            return View();
        }
        public ActionResult ViewItem(string id)
        {
            return View();
        }
    
    }
}