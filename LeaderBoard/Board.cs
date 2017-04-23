using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LeaderBoard
{
    public class Board
    {

        public int Rank { get; set; }
        public int PitStopsCleared { get; set; }
        public int PitStopsRemaining { get { return TotalPitStops - PitStopsCleared; } set { } }
        public string Team { get; set; }
        public static int TotalPitStops { get { return 5; } set { } }

        //public int Rank { get => rank; set => rank = value; }
        //public int PitStopsCleared { get => pitStopsCleared; set => pitStopsCleared = value; }
        //public int PitStopsRemaining { get => (TotalPitStops - PitStopsCleared); set => pitStopsRemaining = value; }
        //public string Team { get => team; set => team = value; }
        //public int TotalPitStops { get => totalPitStops; set => totalPitStops = value; }
    }
}