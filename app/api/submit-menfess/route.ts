import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { template_id, message, sender_name, recipient_name, hashtag, song, image_base64 } = await request.json();

    if (!template_id || !message || !image_base64) {
      return NextResponse.json(
        { error: 'Template, pesan, dan gambar wajib diisi.' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    let imageUrl = '';

    if (supabaseAdmin) {
      // Decode base64 to buffer
      const base64Data = image_base64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `menfess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.png`;

      // Upload to Supabase Storage bucket "menfess"
      let uploadResult = await supabaseAdmin.storage
        .from('menfess')
        .upload(filename, buffer, {
          contentType: 'image/png',
          upsert: true,
        });

      // Auto-create bucket if missing
      if (uploadResult.error && (uploadResult.error.message?.toLowerCase().includes('bucket not found') || uploadResult.error.message?.toLowerCase().includes('not found'))) {
        console.log('Bucket "menfess" not found. Attempting auto-creation...');
        await supabaseAdmin.storage.createBucket('menfess', { public: true });
        
        // Retry upload
        uploadResult = await supabaseAdmin.storage
          .from('menfess')
          .upload(filename, buffer, {
            contentType: 'image/png',
            upsert: true,
          });
      }

      if (uploadResult.error) {
        console.error('Storage upload error:', uploadResult.error);
        return NextResponse.json(
          { error: `Storage upload error: ${uploadResult.error.message}` },
          { status: 500 }
        );
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('menfess')
        .getPublicUrl(filename);

      imageUrl = urlData.publicUrl;

      // Insert into Supabase table "menfess"
      const { error: dbError } = await supabaseAdmin.from('menfess').insert({
        template_id,
        message,
        sender_name: sender_name || null,
        recipient_name: recipient_name || null,
        hashtag: hashtag || null,
        song: song || null,
        image_url: imageUrl,
        status: 'pending',
      });

      if (dbError) {
        console.error('Database insert error:', dbError);
        return NextResponse.json(
          { error: `Database insert error: ${dbError.message}` },
          { status: 500 }
        );
      }
    } else {
      // Fallback demo when Supabase is not configured yet
      imageUrl = image_base64; // mock store base64 in memory/demo
    }

    return NextResponse.json({
      success: true,
      message: 'Menfess berhasil dikirim dan sedang menunggu review admin.',
    });
  } catch (err: any) {
    console.error('Submit API Error:', err);
    return NextResponse.json(
      { error: `Terjadi kesalahan saat mengirim menfess: ${err.message || err}` },
      { status: 500 }
    );
  }
}
