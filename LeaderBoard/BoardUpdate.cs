using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;    


namespace LeaderBoard
{
    public class BoardUpdate
    {
        private readonly static Lazy<BoardUpdate> _instance = new Lazy<BoardUpdate>(() => new BoardUpdate(GlobalHost.ConnectionManager.GetHubContext<BoardHub>().Clients));

        private readonly ConcurrentDictionary<string, Board> _boards = new ConcurrentDictionary<string, Board>();

        private readonly TimeSpan _updateInterval = TimeSpan.FromMilliseconds(5000);

        private readonly Timer _timer;

        private readonly Random _updateOrNotRandom = new Random();

        private readonly object _updateLeaderBoardLock = new object();

        private volatile bool _updatingLeaderBoard = false;

        public static BoardUpdate Instance
        {
            get { return _instance.Value; }
        }

        private IHubConnectionContext<dynamic> Clients
        {
            get;
            set;
        }

        public IEnumerable<Board> GetAllRows()
        {
            return _boards.Values;
        }

        private BoardUpdate(IHubConnectionContext<dynamic> clients)
        {
            Clients = clients;

            _boards.Clear();
            var boards = new List<Board>
            {
                new Board { Team = "team 1", Rank = 1},
                new Board { Team = "team 2", Rank = 2},
                new Board { Team = "team 3", Rank = 3}
            };
            boards.ForEach(board => _boards.TryAdd(board.Team, board));

            

            _timer = new Timer(UpdateLeaderBoard, null, _updateInterval, _updateInterval);

        }

        private void UpdateLeaderBoard(object state)
        {
            lock (_updateLeaderBoardLock)
            {
                if (!_updatingLeaderBoard)
                {
                    _updatingLeaderBoard = true;

                    foreach (var board in _boards.Values)
                    {
                        if(TryUpdateLeaderBoard(board))
                        {
                            BroadCastUpdate(board);
                        }
                        _updatingLeaderBoard = false;  //so that lock is released

                    }
                }
            }
        }

        private bool TryUpdateLeaderBoard(Board board)
        {
            


            //Board.TotalPitStops = 5;
            var randomNumber = new Random();
            board.PitStopsCleared = randomNumber.Next(1, Board.TotalPitStops);
            return true;
        }

        private void BroadCastUpdate(Board board)
        {
            Clients.All.updateLeaderBoard(board);
        }
    }
}