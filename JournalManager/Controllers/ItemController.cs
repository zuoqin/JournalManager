using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using JournalManager.Models;

namespace JournalManager.Controllers
{
    public class ItemController : ApiController
    {
        private JournalDBEntities db = new JournalDBEntities();

        // GET api/Item
        //public IQueryable<Item> GetItems()
        public async Task<IHttpActionResult> GetItems()
        {
            PropertyInfo[] properties1;
            PropertyInfo[] properties2;
            List<Item> theItems = await db.Items.ToListAsync();

            List<ItemDTO> theItemsData = new List<ItemDTO>();
            foreach (var item in theItems)
            {
                properties1 = typeof(ItemDTO).GetProperties();
                properties2 = typeof(Item).GetProperties();

                ItemDTO theItem = new ItemDTO();
                foreach (PropertyInfo property1 in properties1)
                {
                    PropertyInfo theProperty = Array.Find(properties2, p => p.Name.CompareTo(property1.Name) == 0);
                    if (theProperty != null)
                    {
                        var value = theProperty.GetValue(item);
                        property1.SetValue(theItem, value);
                    }
                }
                theItemsData.Add(theItem);
            }
            return Ok(theItemsData);
        }

        // GET api/Item/5
        [ResponseType(typeof(Item))]
        public async Task<IHttpActionResult> GetItem(Guid id)
        {
            PropertyInfo[] properties1;
            PropertyInfo[] properties2;
            Item item = await db.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            properties1 = typeof(ItemDTO).GetProperties();
            properties2 = typeof(Item).GetProperties();
            ItemDTO theItem = new ItemDTO();
            foreach (PropertyInfo property1 in properties1)
            {
                PropertyInfo theProperty = Array.Find(properties2, p => p.Name.CompareTo(property1.Name) == 0);
                if (theProperty != null)
                {
                    var value = theProperty.GetValue(item);
                    property1.SetValue(theItem, value);
                }
            }

            return Ok(theItem);
        }

        // PUT api/Item/5
        public async Task<IHttpActionResult> PutItem(Guid id, Item item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != item.ItemId)
            {
                return BadRequest();
            }

            db.Entry(item).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Item
        [ResponseType(typeof(Item))]
        public async Task<IHttpActionResult> PostItem(Item item)
        {
            PropertyInfo[] properties1;
            PropertyInfo[] properties2;
            properties1 = typeof(ItemDTO).GetProperties();
            properties2 = typeof(Item).GetProperties();
            if (item.Topic == null)
            {
                item.Topic = await db.Topics.Where(e => e.TopicId == item.TopicId).FirstOrDefaultAsync();
            }
            if (item.User == null)
            {
                item.User = await db.Users.Where(e => e.UserId == item.UserId).FirstOrDefaultAsync();
            }
            Guid zeroGuid = new Guid("00000000-0000-0000-0000-000000000000");
            if (item.ItemId.CompareTo(zeroGuid) == 0)
            {
                item.ItemId = Guid.NewGuid();
            }
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors);
                return BadRequest(ModelState);
            }
            Item theItem = await db.Items.Where(e => e.ItemId == item.ItemId).FirstOrDefaultAsync();
            if (theItem != null)
            {
                db.Entry(theItem).State = EntityState.Modified;
                foreach (PropertyInfo property1 in properties1)
                {
                    PropertyInfo theProperty = Array.Find(properties2, p => p.Name.CompareTo(property1.Name) == 0);
                    if (theProperty != null)
                    {
                        var value = theProperty.GetValue(item);

                        theProperty.SetValue(theItem, value);
                    }
                }
                if (theItem.modifiedDate == null)
                {
                    theItem.modifiedDate = DateTime.Now;
                }
            }
            else
            {
                if (item.insertDate == null || item.insertDate.Ticks == 0)
                {
                    item.insertDate = DateTime.Now;
                }
                if (item.modifiedDate == null || item.modifiedDate.Ticks == 0)
                {
                    item.modifiedDate = DateTime.Now;
                }
                if(item.TopicId == 0)
                    item.TopicId = 1;
                if (item.UserId == 0)
                {
                    item.UserId = 1;
                }
                
                db.Items.Add(item);
            }
            

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbEntityValidationException dbEx)
            {
                foreach (var validationErrors in dbEx.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        Trace.TraceInformation("Property: {0} Error: {1}",
                                                validationError.PropertyName,
                                                validationError.ErrorMessage);
                    }
                }
            }
            properties1 = typeof(ItemDTO).GetProperties();
            properties2 = typeof(Item).GetProperties();

            ItemDTO theItemDto = new ItemDTO();
            foreach (PropertyInfo property1 in properties1)
            {
                PropertyInfo theProperty = Array.Find(properties2, p => p.Name.CompareTo(property1.Name) == 0);
                if (theProperty != null)
                {
                    var value = theProperty.GetValue(item);
                    property1.SetValue(theItemDto, value);
                }
            }


            return Ok(theItemDto); //CreatedAtRoute("DefaultApi", new { id = item.ItemId }, item);
        }

        // DELETE api/Item/5
        [ResponseType(typeof(Item))]
        public async Task<IHttpActionResult> DeleteItem(Guid id)
        {
            Item item = await db.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            db.Items.Remove(item);
            await db.SaveChangesAsync();

            return Ok(item);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ItemExists(Guid id)
        {
            return db.Items.Count(e => e.ItemId == id) > 0;
        }
    }
}