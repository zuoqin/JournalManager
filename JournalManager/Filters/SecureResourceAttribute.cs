using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using JournalManager.Models;

namespace JournalManager.Filters
{
    public class SecureResourceAttribute : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var authorizeHeader = actionContext.Request.Headers.Authorization;
            if (authorizeHeader != null
                && authorizeHeader.Scheme.Equals("basic", StringComparison.OrdinalIgnoreCase)
                && String.IsNullOrEmpty(authorizeHeader.Parameter) == false)
            {
                var encoding = Encoding.GetEncoding("ISO-8859-1");
                var credintials = encoding.GetString(
                                   Convert.FromBase64String(authorizeHeader.Parameter));
                string username = credintials.Split(':')[0];
                string password = credintials.Split(':')[1];
                string roleOfUser = string.Empty;
                JournalDBEntities db = new JournalDBEntities();
                try
                {
                    User theUser = db.Users.Where(
                        e => (e.UserName == username)).FirstOrDefault();

                    //ActivityBAL bal = new ActivityBAL();
                    if (theUser != null && theUser.UserPassword.CompareTo(password) == 0)
                    {
                        var principal = new GenericPrincipal((new GenericIdentity(username)),
                                                                    (new[] { roleOfUser }));
                        Thread.CurrentPrincipal = principal;
                        return;
                    }
                }
                catch (Exception exception)
                {
                    
                    Debug.Print(exception.ToString());
                }
            }
            actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);

            actionContext.Response.Content = new StringContent("Username and password are missings or invalid");
            return;
        }
    } 
}