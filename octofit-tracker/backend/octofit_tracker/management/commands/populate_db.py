from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing data...')
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Creating users (superheroes)...')
        users_data = [
            {'name': 'Tony Stark',       'username': 'ironman',      'email': 'ironman@avengers.com',    'password': 'ironman123'},
            {'name': 'Steve Rogers',     'username': 'cap',          'email': 'cap@avengers.com',        'password': 'cap123'},
            {'name': 'Natasha Romanoff', 'username': 'blackwidow',   'email': 'blackwidow@avengers.com', 'password': 'widow123'},
            {'name': 'Bruce Banner',     'username': 'hulk',         'email': 'hulk@avengers.com',       'password': 'hulk123'},
            {'name': 'Bruce Wayne',      'username': 'batman',       'email': 'batman@dc.com',           'password': 'batman123'},
            {'name': 'Clark Kent',       'username': 'superman',     'email': 'superman@dc.com',         'password': 'superman123'},
            {'name': 'Diana Prince',     'username': 'wonderwoman',  'email': 'wonderwoman@dc.com',      'password': 'wonder123'},
            {'name': 'Barry Allen',      'username': 'flash',        'email': 'flash@dc.com',            'password': 'flash123'},
        ]
        users = {}
        for data in users_data:
            user = User.objects.create(**data)
            users[data['name']] = user
            self.stdout.write(f'  Created user: {user.name}')

        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(name='Team Marvel')
        team_marvel.members.set([
            users['Tony Stark'], users['Steve Rogers'],
            users['Natasha Romanoff'], users['Bruce Banner'],
        ])

        team_dc = Team.objects.create(name='Team DC')
        team_dc.members.set([
            users['Bruce Wayne'], users['Clark Kent'],
            users['Diana Prince'], users['Barry Allen'],
        ])
        self.stdout.write('  Created Team Marvel and Team DC')

        self.stdout.write('Creating activities...')
        activities_data = [
            {'user': users['Tony Stark'], 'activity_type': 'Running', 'duration': 30, 'date': date(2024, 1, 10)},
            {'user': users['Steve Rogers'], 'activity_type': 'Weight Training', 'duration': 60, 'date': date(2024, 1, 11)},
            {'user': users['Natasha Romanoff'], 'activity_type': 'Yoga', 'duration': 45, 'date': date(2024, 1, 12)},
            {'user': users['Bruce Banner'], 'activity_type': 'Cycling', 'duration': 50, 'date': date(2024, 1, 13)},
            {'user': users['Bruce Wayne'], 'activity_type': 'Martial Arts', 'duration': 90, 'date': date(2024, 1, 10)},
            {'user': users['Clark Kent'], 'activity_type': 'Flying', 'duration': 20, 'date': date(2024, 1, 11)},
            {'user': users['Diana Prince'], 'activity_type': 'Sword Training', 'duration': 75, 'date': date(2024, 1, 12)},
            {'user': users['Barry Allen'], 'activity_type': 'Sprinting', 'duration': 15, 'date': date(2024, 1, 13)},
        ]
        for data in activities_data:
            Activity.objects.create(**data)
        self.stdout.write(f'  Created {len(activities_data)} activities')

        self.stdout.write('Creating leaderboard entries...')
        leaderboard_data = [
            {'user': users['Tony Stark'],       'score': 850,  'total_calories': 3200},
            {'user': users['Steve Rogers'],     'score': 920,  'total_calories': 4100},
            {'user': users['Natasha Romanoff'], 'score': 780,  'total_calories': 2900},
            {'user': users['Bruce Banner'],     'score': 860,  'total_calories': 3400},
            {'user': users['Bruce Wayne'],      'score': 950,  'total_calories': 4500},
            {'user': users['Clark Kent'],       'score': 1000, 'total_calories': 5000},
            {'user': users['Diana Prince'],     'score': 975,  'total_calories': 4800},
            {'user': users['Barry Allen'],      'score': 900,  'total_calories': 3800},
        ]
        for data in leaderboard_data:
            Leaderboard.objects.create(**data)
        self.stdout.write(f'  Created {len(leaderboard_data)} leaderboard entries')

        self.stdout.write('Creating workouts...')
        workouts_data = [
            {'name': 'Iron Man Cardio Blast',   'description': 'High-intensity cardio inspired by Iron Man suit drills',         'duration': 30, 'intensity': 'High',   'workout_type': 'Cardio',       'calories_burned': 420},
            {'name': 'Super Soldier Strength',  'description': "Weight training program based on Captain America's routine",     'duration': 60, 'intensity': 'High',   'workout_type': 'Strength',     'calories_burned': 680},
            {'name': 'Black Widow Flexibility', 'description': 'Full-body yoga and flexibility routine',                         'duration': 45, 'intensity': 'Medium', 'workout_type': 'Flexibility',  'calories_burned': 280},
            {'name': 'Hulk Smash Circuit',      'description': 'Power-focused circuit training',                                 'duration': 50, 'intensity': 'High',   'workout_type': 'Circuit',      'calories_burned': 600},
            {'name': 'Batman Combat Training',  'description': 'Martial arts and combat readiness workout',                      'duration': 90, 'intensity': 'High',   'workout_type': 'Martial Arts', 'calories_burned': 900},
            {'name': 'Wonder Woman Endurance',  'description': 'Long-duration endurance training with sword and shield drills',  'duration': 75, 'intensity': 'Medium', 'workout_type': 'Endurance',    'calories_burned': 750},
            {'name': 'Flash Speed Drills',      'description': 'Sprint intervals and agility ladder drills',                     'duration': 20, 'intensity': 'High',   'workout_type': 'Cardio',       'calories_burned': 360},
            {'name': 'Superman Recovery',       'description': 'Low-intensity recovery and mobility',                            'duration': 30, 'intensity': 'Low',    'workout_type': 'Recovery',     'calories_burned': 150},
        ]
        for data in workouts_data:
            Workout.objects.create(**data)
        self.stdout.write(f'  Created {len(workouts_data)} workouts')

        self.stdout.write(self.style.SUCCESS('Database populated successfully with superhero test data!'))
