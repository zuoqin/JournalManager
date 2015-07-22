using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
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
    public class TopicController : ApiController
    {
        private JournalDBEntities db = new JournalDBEntities();

        // GET api/Topic
        public async Task<IHttpActionResult> GetTopics()
        {
            List<TopicDTO> theTopicsData = new List<TopicDTO>();
            TopicDTO theTopic = new TopicDTO();
            theTopic.TopicId = 1;
            theTopic.Description = "Programming";
            theTopicsData.Add(theTopic);

            theTopic = new TopicDTO();
            theTopic.TopicId = 2;
            theTopic.Description = "General";
            theTopicsData.Add(theTopic);
            /*
            PropertyInfo[] properties1;
            PropertyInfo[] properties2;
            List<Topic> theTopics = await db.Topics.ToListAsync();

            
            foreach (var topic in theTopics)
            {
                properties1 = typeof(TopicDTO).GetProperties();
                properties2 = typeof(Topic).GetProperties();

                TopicDTO theTopic = new TopicDTO();
                foreach (PropertyInfo property1 in properties1)
                {
                    PropertyInfo theProperty = Array.Find(properties2, p => p.Name.CompareTo(property1.Name) == 0);
                    if (theProperty != null)
                    {
                        var value = theProperty.GetValue(topic);
                        property1.SetValue(theTopic, value);
                    }
                }
                theTopicsData.Add(theTopic);
            }*/
            return Ok(theTopicsData);

        }

        // GET api/Topic/5
        [ResponseType(typeof(Topic))]
        public async Task<IHttpActionResult> GetTopic(int id)
        {
            Topic topic = await db.Topics.FindAsync(id);
            if (topic == null)
            {
                return NotFound();
            }

            return Ok(topic);
        }

        // PUT api/Topic/5
        public async Task<IHttpActionResult> PutTopic(int id, Topic topic)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != topic.TopicId)
            {
                return BadRequest();
            }

            db.Entry(topic).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TopicExists(id))
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

        // POST api/Topic
        [ResponseType(typeof(Topic))]
        public async Task<IHttpActionResult> PostTopic(Topic topic)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Topics.Add(topic);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TopicExists(topic.TopicId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = topic.TopicId }, topic);
        }

        // DELETE api/Topic/5
        [ResponseType(typeof(Topic))]
        public async Task<IHttpActionResult> DeleteTopic(int id)
        {
            Topic topic = await db.Topics.FindAsync(id);
            if (topic == null)
            {
                return NotFound();
            }

            db.Topics.Remove(topic);
            await db.SaveChangesAsync();

            return Ok(topic);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TopicExists(int id)
        {
            return db.Topics.Count(e => e.TopicId == id) > 0;
        }
    }
}