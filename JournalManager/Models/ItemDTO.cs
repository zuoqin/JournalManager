using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JournalManager.Models
{
    public class ItemDTO
    {
        public System.Guid ItemId { get; set; }
        public int TopicId { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Introduction { get; set; }
        public string Contents { get; set; }
    }
}