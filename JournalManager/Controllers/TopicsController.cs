﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JournalManager.Controllers
{
    public class TopicsController : Controller
    {
        // GET: /Topics/
        public ActionResult Index()
        {
            return View();
        }
    }
}
