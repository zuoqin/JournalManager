using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JournalItems.Controllers
{
    public class HomesController : Controller
    {
        //
        // GET: /Homes/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult New()
        {
            return View("edit");
        }

        public ActionResult Edit(string id, string label)
        {
            return View();
        }
    }
}