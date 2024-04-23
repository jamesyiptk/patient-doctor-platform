import json

from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
import pytz
from django.utils.dateparse import parse_datetime
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.http import FileResponse, Http404, HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect

from .forms import PatientLoginForm, PatientRegisterForm, DoctorLoginForm, DoctorRegisterForm, PostForm, Comment
from .models import Post, PatientProfile, DoctorProfile, Category

from rest_framework import generics, viewsets
from .models import Article
from .serializers import ArticleSerializer, PostSerializer, CommentSerializer, CategorySerializer, DoctorSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class DoctorListView(APIView):
    def get(self, request, format=None):
        doctors = DoctorProfile.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)

class DoctorDetailView(APIView):
    def get(self, request, id):
        doctor = get_object_or_404(DoctorProfile, user__id=id)
        serializer = DoctorProfileSerializer(doctor)
        return Response(serializer.data)

class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer


# class PostViewSet(viewsets.ModelViewSet):
#     queryset = Post.objects.all().prefetch_related('comments')
#     serializer_class = PostSerializer
class PostViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or creating posts.
    """

    def list(self, request):
        queryset = Post.objects.all()
        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.data)
            print('error here')
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentCreateAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateCommentView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)  # Assuming your user is authenticated
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'success': True, 'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'success': False, 'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@csrf_protect
def patient_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_active:
            # Check if the user has a PatientProfile
            if hasattr(user, 'patientprofile'):
                login(request, user)
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'errors': 'Invalid patient credentials'})
        else:
            return JsonResponse({'success': False, 'errors': 'Invalid username or password'})
    else:
        return render(request, 'index.html')


@csrf_protect
def patient_register(request):
    if request.method == 'POST':
        print(request.POST)
        form = PatientRegisterForm(request.POST, request.FILES)

        if not form.is_valid():
            print(form.errors)  # This will print errors to the console
            return JsonResponse({'success': False, 'errors': form.errors})

        if form.is_valid():
            new_user = User.objects.create_user(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password'],
                email=form.cleaned_data['email'],
                first_name=form.cleaned_data['first_name'],
                last_name=form.cleaned_data['last_name']
            )
            new_user.save()

            PatientProfile.objects.create(
                user=new_user,
                phone_number=form.cleaned_data['phone_number'],
                age=form.cleaned_data['age'],
                gender=form.cleaned_data['gender']
            )

            new_user = authenticate(username=form.cleaned_data['username'],
                                    password=form.cleaned_data['password'])

            if new_user is not None:
                login(request, new_user)
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    else:  # GET request
        return render(request, 'index.html')


def patient_logout(request):
    logout(request)
    return redirect(reverse('login'))


@csrf_protect
def doctor_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_active:
            # Check if the user has a DoctorProfile
            if hasattr(user, 'doctorprofile'):
                login(request, user)
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'errors': 'Invalid doctor credentials'})
        else:
            return JsonResponse({'success': False, 'errors': 'Invalid username or password'})
    else:
        return render(request, 'index.html')


def doctor_logout(request):
    logout(request)
    return redirect(reverse('doctor_login'))


@csrf_protect
def doctor_register(request):
    if request.method == 'POST':
        print(request.POST)
        form = DoctorRegisterForm(request.POST, request.FILES)

        if not form.is_valid():
            print(form.errors)  # This will print errors to the console
            return JsonResponse({'success': False, 'errors': form.errors})

        if form.is_valid():
            new_user = User.objects.create_user(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password'],
                email=form.cleaned_data['email'],
                first_name=form.cleaned_data['first_name'],
                last_name=form.cleaned_data['last_name']
            )
            new_user.save()

            DoctorProfile.objects.create(
                user=new_user,
                phone_number=form.cleaned_data['phone_number'],
                specialty=form.cleaned_data['specialty'],
                position=form.cleaned_data['position'],
                hospital=form.cleaned_data['hospital'],
                address=form.cleaned_data['address'],
                photo=form.cleaned_data['photo']
            )

            new_user = authenticate(username=form.cleaned_data['username'],
                                    password=form.cleaned_data['password'])

            if new_user is not None:
                login(request, new_user)
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    else:  # GET request
        return render(request, 'index.html')


def global_stream_view(request):
    posts = Post.objects.all().order_by('-created_at')  # sort by time

    categories = Category.objects.all()  # Category

    return render(request, 'pdp/post_global.html', {'posts': posts, 'categories': categories})


def article_stream_view(request):
    return render(request, 'pdp/articles.html')


@login_required
def create_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST, author=request.user)
        if form.is_valid():
            category_id = request.POST.get('category')
            category = get_object_or_404(Category, pk=category_id)

            post = form.save(commit=False)
            post.author = request.user
            post.save()

            # Convert post object to dictionary
            post_data = model_to_dict(
                post, fields=['id', 'content', 'author', 'created_at'])
            # Assuming you want the username in the response
            post_data['id'] = post.id
            # Assuming you want the username in the response
            post_data['author'] = post.author.username
            post_data['first_name'] = post.author.first_name
            post_data['last_name'] = post.author.last_name
            post_data['category'] = post.category.name

            # Convert the created_at time to US Eastern time zone
            us_eastern_tz = pytz.timezone('US/Eastern')
            us_eastern_time = post.created_at.astimezone(us_eastern_tz)

            # Format the time as a string without leading zeros
            formatted_time = us_eastern_time.strftime('%#m/%#d/%Y %#I:%M %p')
            post_data['created_at'] = formatted_time

            return JsonResponse({'success': True, 'post': post_data})
        else:
            return JsonResponse({'success': False, 'errors': form.errors.as_json()})
    else:
        return JsonResponse({'success': False, 'errors': 'Invalid request method'})


def add_comment(request):
    """
    Handles the addition of a new comment to a post.
    """
    try:
        if request.method == 'POST':
            # data = json.loads(request.body)
            comment_text = request.POST.get('comment_text')
            post_id = request.POST.get('post_id')

            print(request.POST)
            # comment_text = data.get('comment_text')
            # post_id = data.get('post_id')
            if not comment_text or not post_id:
                print('comment_text or not post_id')
                return JsonResponse({'error': 'Missing comment_text or post_id'}, status=400)
            try:
                post_id = int(post_id)  # 尝试将 post_id 转换为整数
            except ValueError:
                # 如果转换失败，返回错误信息
                return JsonResponse({'error': 'Invalid post_id. post_id must be a number.'}, status=400)

            try:
                post = get_object_or_404(Post, id=post_id)
            except Http404:
                return JsonResponse({'error': 'Post does not exist'}, status=400)

            if request.user.is_authenticated:
                # Create a new comment instance but don't save it yet
                comment = Comment(text=comment_text,
                                  author=request.user, post=post)
                # Optionally do any additional processing here
                comment.save()
                comment.author = request.user  # Set the author to the currently logged-in user
                comment.post = post  # Associate the comment with the specified post
                comment.save()  # Finally, save the comment to the database
                comment_data = model_to_dict(comment, fields=['id', 'text', 'author',
                                                              'created_at'])  # Convert comment object to dictionary
                comment_data['post_id'] = post.id
                comment_data['last_name'] = comment.author.last_name
                comment_data['first_name'] = comment.author.first_name
                comment_data['text'] = comment.text
                # Assuming you want the username in the response
                comment_data['username'] = comment.author.username

                # Convert the created_at time to US Eastern time zone
                us_eastern_tz = pytz.timezone('US/Eastern')
                us_eastern_time = comment.created_at.astimezone(us_eastern_tz)

                # Format the time as a string without leading zeros
                formatted_time = us_eastern_time.strftime(
                    '%#m/%#d/%Y %#I:%M %p')
                comment_data['created_at'] = formatted_time

                return JsonResponse(
                    {'success': True, 'comment': comment_data})  # Return success response with comment data
            else:
                return JsonResponse({'error': 'User not logged in'}, status=401)
        else:
            return JsonResponse({'error': 'POST request required'},
                                status=405)  # Return error response for invalid request method

    except Exception as e:
        return JsonResponse({'error': 'Internal Server Error'}, status=500)


def fetch_posts(request):
    if request.method == 'GET':
        if not request.user.is_authenticated:
            # not logged in
            return JsonResponse({'error': 'User not logged in.'}, status=401)
        #  request.GET.get('last_update', None)
        last_update = request.GET.get('last_update', None)

        if last_update:
            last_update_dt = parse_datetime(last_update)
            # ensure format
            if last_update_dt:
                new_posts = Post.objects.filter(
                    created_at__gt=last_update_dt).prefetch_related('comments')
            else:
                # incorrect format
                return JsonResponse({'error': 'Invalid last_update format.'}, status=400)
        else:
            new_posts = Post.objects.all().prefetch_related('comments')

        us_eastern_tz = pytz.timezone('US/Eastern')
        posts_data = [{
            'id': post.id,
            'author_username': post.author.username,
            'author_first_name': post.author.first_name,
            'author_last_name': post.author.last_name,
            'created_at': post.created_at.astimezone(us_eastern_tz).strftime('%#m/%#d/%Y %#I:%M %p'),
            # 使用 %-m 和 %-d 以兼容更多环境
            'content': post.content,
            'comments': [{
                'id': comment.id,
                'text': comment.text,
                'author_username': comment.author.username,
                'author_first_name': comment.author.first_name,
                'author_last_name': comment.author.last_name,
                'created_at': comment.created_at.astimezone(us_eastern_tz).strftime('%#m/%#d/%Y %#I:%M %p'),
            } for comment in post.comments.all()]
        } for post in new_posts]

        return JsonResponse({'posts': posts_data})

    # if not get, return false
    return JsonResponse({'error': 'GET request required.'}, status=400)


