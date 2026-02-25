from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            name='Tony Stark',
            email='ironman@avengers.com',
            password='ironman123',
        )

    def test_get_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        data = {'name': 'Steve Rogers', 'email': 'cap@avengers.com', 'password': 'cap123'}
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class TeamTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(name='Team Marvel')

    def test_get_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_team(self):
        data = {'name': 'Team DC'}
        response = self.client.post('/api/teams/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ActivityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            name='Bruce Banner',
            email='hulk@avengers.com',
            password='hulk123',
        )
        self.activity = Activity.objects.create(
            user=self.user,
            activity_type='Running',
            duration=30,
            date=date(2024, 1, 10),
        )

    def test_get_activities(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            name='Diana Prince',
            email='wonderwoman@dc.com',
            password='wonder123',
        )
        self.entry = Leaderboard.objects.create(user=self.user, score=975)

    def test_get_leaderboard(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.workout = Workout.objects.create(
            name='Iron Man Cardio Blast',
            description='High-intensity cardio inspired by Iron Man suit drills',
            duration=30,
            intensity='High',
        )

    def test_get_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_workout(self):
        data = {
            'name': 'Batman Combat Training',
            'description': 'Martial arts and combat readiness workout',
            'duration': 90,
            'intensity': 'High',
        }
        response = self.client.post('/api/workouts/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ApiRootTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_root(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_root_redirects_to_api(self):
        response = self.client.get('/')
        self.assertIn(response.status_code, [status.HTTP_301_MOVED_PERMANENTLY, status.HTTP_302_FOUND])
