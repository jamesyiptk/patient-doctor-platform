from rest_framework import serializers
from .models import Article, Post, Comment, Category, DoctorProfile


class ArticleSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Article
        fields = ['title', 'content', 'category', 'category_name']

# class CommentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Comment
#         fields = ['id', 'post', 'author', 'text', 'created_at']
class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')  # Assuming you have a username field

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'text', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(write_only=True, allow_blank=True, required=False)
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'author', 'content', 'created_at', 'category_name', 'comments']

    def create(self, validated_data):
        # Handle category_name for creating a new Post
        category_name = validated_data.pop('category_name', None)
        category = None
        if category_name:
            category, created = Category.objects.get_or_create(name=category_name)
        else:
            # Optionally handle the case where no category_name is provided
            # For instance, assign a default category or leave it as None
            category = Category.objects.get_or_create(name="General")[0]
        
        post = Post.objects.create(**validated_data, category=category)
        return post

    def to_representation(self, instance):
        """
        Because category_name is write_only, need to explicitly
        add it to the representation if  want it included in read operations.
        """
        representation = super(PostSerializer, self).to_representation(instance)
        representation['category_name'] = instance.category.name if instance.category else None
        return representation

    def validate_category_name(self, value):
        # Your validation logic here
        # check if the category name meets certain conditions
        # If not, raise a serializers.ValidationError
        if value and not Category.objects.filter(name=value).exists():
            raise serializers.ValidationError("This category does not exist.")
        return value


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']